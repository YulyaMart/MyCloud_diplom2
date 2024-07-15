from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import UserProfile

class Command(BaseCommand):
    help = 'Create UserProfile for superuser'

    def handle(self, *args, **kwargs):
        superuser = User.objects.filter(is_superuser=True).first()
        if superuser:
            UserProfile.objects.get_or_create(
                user=superuser,
                full_name=superuser.username,
                is_admin=True,
                storage_path='/path/to/superuser/storage',
                email=superuser.email
            )
            self.stdout.write(self.style.SUCCESS('UserProfile created for superuser'))
        else:
            self.stdout.write(self.style.WARNING('No superuser found'))
