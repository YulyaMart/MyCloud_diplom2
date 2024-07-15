import React, { useState } from 'react';
import Navbar from '../NavBar/NavBar';
import FilesList from '../FilesList/FilesList';
import FileUpload from '../FileUpload/FileUpload';
import UsersList from '../UsersList/UsersList';

import './Files.css';

const Files = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  console.log('isadmin', isAdmin)

  return (
    <div>
      <Navbar />
      {isAdmin && <UsersList onUserSelect={handleUserSelect} />}
      {selectedUser ? (
        <div key={selectedUser.id}>
          <h2 className='files-header'>{`Файлы пользователя ${selectedUser.username}`}</h2>
          <FilesList userId={selectedUser.id} />
        </div>
      ) : (
        <div>
          <FilesList />
        </div>
      )}
      {!selectedUser && <FileUpload />}
    </div>
  );
};

export default Files;
