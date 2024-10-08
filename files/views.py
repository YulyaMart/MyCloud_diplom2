import json

from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, permissions

import uuid
import base64
import os

from .models import File, UserProfile
from .serializers import FileSerializer

from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.core.files import File as DjangoFile
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, Http404
from django.http import JsonResponse, HttpResponseBadRequest



class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(user_profile=self.request.user.userprofile)


# view function provides a way for users to retrieve their own files or all files if they have admin privileges
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_user_files(request):
    try:
        is_admin = request.user.is_staff

        if is_admin and 'user_id' in request.query_params:
            target_user_id = request.query_params.get('user_id')
            try:
                target_user = UserProfile.objects.get(pk=target_user_id)
                user_files = File.objects.filter(user_profile=target_user)
            except UserProfile.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
        else:
            user_files = File.objects.filter(user_profile=request.user.userprofile)

        serializer = FileSerializer(user_files, many=True)
        return Response(serializer.data)
    except PermissionDenied:
        return JsonResponse({'error': 'Permission denied'}, status=403)


# view function provides a way for users to upload a file
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    if request.method == 'POST':
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'User profile not found for the current user'}, status=400)

        try:
            file = request.FILES['file']
            name = file.name.encode('utf-8').decode('utf-8')  # Ensure UTF-8 encoding
            size = file.size
            mime_type = file.content_type

            user_directory = user_profile.storage_path

            user_directory_path = default_storage.path(os.path.join(user_directory))
            os.makedirs(user_directory_path, exist_ok=True)

            unique_name = default_storage.get_available_name(name)
            storage_path = default_storage.path(os.path.join(user_directory, unique_name))

            with default_storage.open(storage_path, 'wb') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            file_object = File.objects.create(
                user_profile=user_profile,
                name=name,
                size=size,
                mime_type=mime_type,
                storage_path=storage_path,
            )
            file_object.save()
            print(file_object.mime_type)

            return JsonResponse({'message': 'File uploaded successfully', 'file_id': file_object.id})
        except Exception as e:
            print(f"Error in upload_file: {e}")
            return JsonResponse({'error': 'An error occurred while processing the request'}, status=500)
    else:
        return HttpResponseBadRequest('Invalid request method')


# view function provides a way for users to share a file with another user
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def share_file(request, file_id):
    file_object = get_object_or_404(File, id=file_id)

    if request.method == 'POST':
        unique_code = base64.urlsafe_b64encode(uuid.uuid4().bytes).rstrip(b'=').decode('utf-8')
        special_link = request.build_absolute_uri(f'/dwnld/{unique_code}')
        file_object.special_link = special_link
        file_object.save()
        return JsonResponse({'special_link': special_link})
    else:
        return JsonResponse({'error': 'Invalid request method'})


# view function provides a way for user to download a file
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def download_file(request, file_id):
    try:
        file = File.objects.get(pk=file_id)
        if request.user != file.user_profile.user:
            raise PermissionDenied
        with open(file.storage_path, 'rb') as file_content:
            response = HttpResponse(file_content.read(), content_type=file.mime_type)
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        print(response['Content-Disposition'])
        return response
    except File.DoesNotExist:
        return JsonResponse({'error': 'File not found'})
    except PermissionDenied:
        return JsonResponse({'error': 'Permission denied'}, status=403)


# view function provides a way for users to rename a file
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def rename_file(request, file_id):
    try:
        file = File.objects.get(pk=file_id)
        data = json.loads(request.body)
        new_name = data.get('new_name')

        user_directory = os.path.dirname(file.storage_path)
        old_storage_path = file.storage_path
        new_storage_path = os.path.join(user_directory, new_name)

        with default_storage.open(old_storage_path, 'rb') as old_file:
            default_storage.save(new_storage_path, DjangoFile(old_file))

        default_storage.delete(old_storage_path)

        file.name = new_name
        file.storage_path = new_storage_path
        file.save()

        return JsonResponse({'message': 'File renamed successfully', 'new_path': new_storage_path})
    except File.DoesNotExist:
        return JsonResponse({'error': 'File not found'})
    except PermissionDenied:
        return JsonResponse({'error': 'Permission denied'}, status=403)


# view function provides a way for users to update a file's comment
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_file_comment(request, file_id):
    try:
        file = File.objects.get(pk=file_id)
        data = json.loads(request.body)
        new_comment = data.get('new_comment')
        file.comment = new_comment
        file.save()

        return JsonResponse({'message': 'File comment updated successfully'})
    except File.DoesNotExist:
        return JsonResponse({'error': 'File not found'})
    except PermissionDenied:
        return JsonResponse({'error': 'Permission denied'}, status=403)


# view function provides a way for users to delete a file
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    try:
        file = File.objects.get(pk=file_id)
        default_storage.delete(file.storage_path)
        file.delete()
        return JsonResponse({'message': 'File deleted successfully'})
    except File.DoesNotExist:
        return JsonResponse({'error': 'File not found'})
    except PermissionDenied:
        return JsonResponse({'error': 'Permission denied'}, status=403)


# view function provides a way for users to download a shared file
@api_view(['GET'])
def download_sharedfile(request, unique_code):
    file_object = get_object_or_404(File, special_link=f'http://95.163.221.33/dwnld/{unique_code}')
    file_path = str(file_object.storage_path)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            filename = os.path.basename(file_object.name)
            response['Content-Disposition'] = f'attachment; filename={filename.encode("utf-8").decode("latin-1")}'
            response['Access-Control-Allow-Origin'] = 'http://95.163.221.33:5173'
            response['Access-Control-Allow-Methods'] = 'GET'
            return response
    else:
        raise Http404
