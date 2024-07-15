import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadFile } from '../../redux/filesActions';
import './FileUpload.css';

const FileUpload = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        dispatch(uploadFile(formData));
        setFile(null);
        setUploadSuccess(true);
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    }

  };

  return (
    <div className='file-upload-container'>
      <h2>Загрузить файл</h2>
      <label htmlFor="file-input">
        <input className='file-input' id="file-input" type="file" onChange={handleFileChange} />
      </label>
      <button className='upload-button' onClick={handleUpload}>Загрузить</button>
      {uploadSuccess && <p>Файл успешно загружен!</p>}
    </div>
  );
};

export default FileUpload;
