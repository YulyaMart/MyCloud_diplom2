import { fetchFilesSuccess, fetchFilesFailure } from './filesReducers';
import apiUrl from '../apiConfig'

// Function to fetch files from the API
export const fetchFiles = (userId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      console.log('Token:', token)
      const isAdmin = localStorage.getItem('isAdmin') === 'true'

      let url = `${apiUrl}/api/files/get-files/`;

      if (userId) {
        url += `?user_id=${userId}`;
      }
      const response = await fetch(url, {
        headers: {
          // 'Authorization': `Token ${token}`,
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched data files:', data)
      dispatch(fetchFilesSuccess(data));
    } catch (error) {
      dispatch(fetchFilesFailure(error.message));
    }
  };
};


// Function to upload a file to the API
export const uploadFile = (formData) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/files/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData,
      });
      console.log(response)
  
      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data);
      dispatch(fetchFiles());
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };
};
  
// Function to download a file from the API
export const downloadFile = (fileId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/files/download/${fileId}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });
      console.log(response);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const contentDispositionHeader = response.headers.get('Content-Disposition');
      console.log('Content-Disposition header:', contentDispositionHeader);

      let filename;

      if (contentDispositionHeader) {
        if (contentDispositionHeader.includes('=?utf-8?b?')) {
          const base64Encoded = contentDispositionHeader.split('=?utf-8?b?')[1].split('?=')[0];
          const contentDispositionHeaderDecode = new TextDecoder().decode(new Uint8Array(atob(base64Encoded).split('').map(c => c.charCodeAt(0))));;
          filename = contentDispositionHeaderDecode.split('; ')[1].trim().replace('filename=', '');
        } else {
          filename = contentDispositionHeader.split('; ')[1].trim().replace('filename=', '');
        }
      } else {
        filename = fileId;
        console.warn('Content-Disposition header is missing. Using fileID.');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      document.body.appendChild(link);
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.click();
      document.body.removeChild(link);
      console.log('File download successfully') 
      dispatch(fetchFiles());
    } catch (error) {
      console.error('Error downloading file:', error.message);
    }
  };
};
  
// Function to rename a file in the API 
export const renameFile = (fileId, newName) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/files/rename/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_name: newName }),
      });

      if (!response.ok) {
        throw new Error(`Error renaming file: ${response.statusText}`);
      }

      dispatch(fetchFiles());

      console.log('File renamed successfully');
    } catch (error) {
      console.error('Error renaming file:', error.message);
    }
  };
};

// Function to change the comment of a file in the API
export const changeComment = (fileId, newComment) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/files/comment/${fileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_comment: newComment }),
      });

      if (!response.ok) {
        throw new Error(`Error change comment: ${response.statusText}`);
      }

      dispatch(fetchFiles());
      console.log('Comment changed successfully');
    } catch (error) {
      console.error('Error changing comment:', error.message);
    }
  };
};

// Function to delete a file from the API
export const deleteFile = (fileId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/files/delete/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting file: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('File deleted successfully:', data);
      dispatch(fetchFiles());
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
  };
};

// Function to share a file and generate a special link
export const shareFile = (fileId) => {
  return async(dispatch) => {
    try {
      const token = localStorage.getItem('authorization');
      const response = await fetch(`${apiUrl}/api/files/share/${fileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          },
        })

      if (!response.ok) {
        throw new Error(`Error generating special link: ${response.statusText}`);
      }

      const result = await response.json();
      const specialLink = result.special_link;
      alert(`Специальная ссылка для скачивания: ${specialLink}`);
    } catch (error) {
      console.error('Error sharing file:', error.message);
    }
  };
};

