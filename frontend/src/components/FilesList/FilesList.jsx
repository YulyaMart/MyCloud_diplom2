import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFiles, downloadFile, renameFile, changeComment, deleteFile, shareFile } from '../../redux/filesActions';
import { Edit2, Download, Share2, Trash2 } from "lucide-react";

import './FilesList.css';

const FilesList = ({ userId }) => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.files.files);
  const loading = useSelector((state) => state.files.loading);
  const error = useSelector((state) => state.files.error);

  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    if (userId) {
    dispatch(fetchFiles(userId));
    } else { dispatch(fetchFiles()); }
  }, [dispatch, userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleFileClick = (file, event) => {
    setSelectedFile(file);
    console.log(selectedFile);
  };

  // const handleDownloadClick = () => {
  //     dispatch(downloadFile(selectedFile.id));
  //     setSelectedFile(null);
  // };
  
  const handleDownloadClick = (fileId) => {
    dispatch(downloadFile(fileId));
    setSelectedFile(null);
  };

  const handleRename = (fileId, newName) => {
    dispatch(renameFile(fileId, newName));
    setSelectedFile(null);
  };
  
  const handleChange = (fileId, newComment) => {
    dispatch(changeComment(fileId, newComment));
    setSelectedFile(null);
  };

  const handleDelete = () => {
      dispatch(deleteFile(selectedFile.id));
      setSelectedFile(null);
  };

  const handleShare = () => {
      dispatch(shareFile(selectedFile.id))
      setSelectedFile(null);
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <div className='file-list-container'>
      <h2 className='file-list-header'>Список файлов</h2>
        <table>
          <thead>
            <tr>
              <th>Имя файла</th>
              <th>Размер (КБ)</th>
              <th>Комментарий</th>
              <th>Дата загрузки</th>
              <th>Последняя дата скачивания</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(files) && files.map((file) => (
              <tr className='table-string' key={file.id}>
                <td
                  onClick={(event) => handleFileClick(file, event)}
                  style={{ cursor: 'pointer'}}
                >
                  {file.name}
                  <button className='file-button' title='Переименовать' onClick={() => handleRename(file.id, prompt('Enter new file name:'))}>
                    <Edit2 size={16} />
                  </button>
                  <button className='file-button' title='Скачать' onClick={() => handleDownloadClick(file.id)}>
                    <Download size={16} />
                  </button>
                  <button className='file-button' title='Поделиться' onClick={() => handleShare(file.id)}>
                    <Share2 size={16} />
                  </button>
                  <button className='file-button delete-button' title='Удалить' onClick={() => {
                    if (window.confirm('Are you sure you want to delete this file?')) {
                      handleDelete(file.id);
                    }
                  }}>
                    <Trash2 size={16} />
                  </button>
                </td>
                <td>{file.size / 1000} КБ</td>
                <td>{file.comment}
                  <button className='file-button' title='Добавить комментарий' onClick={() => handleChange(file.id, prompt('Enter new comment:'))}>
                    <Edit2 size={16} />
                  </button>
                </td>
                <td>{formatDate(file.upload_date)}</td>
                <td>{formatDate(file.last_download_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>

    </div>
  );
};

export default FilesList;
