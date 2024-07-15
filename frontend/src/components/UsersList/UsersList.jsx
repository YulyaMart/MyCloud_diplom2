import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser, changeStatus } from '../../redux/usersActions'

import './UsersList.css'

const UsersList = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users.users);
  // const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    console.log('Effect started');
    dispatch(fetchUsers());
  }, [dispatch]);
  
  console.log('Users:', users);

  const handleDeleteUser = (userId) => {
      dispatch(deleteUser(userId));
}


  const toggleAdminStatus = (userId) => {
    dispatch(changeStatus(userId));
  };

  return (
    <div className='user-list-container'>
      <h2 className='user-list-header'>Список пользователей</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Имя пользователя</th>
            <th>Полное имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
            <th>Выбрать</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.is_admin ? 'Администратор' : 'Обычный пользователь'}</td>
              {(
                <td>
                  <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                  <button onClick={() => toggleAdminStatus(user.id)}>
                    {user.is_admin ? 'Сделать обычным' : 'Сделать администратором'}
                  </button>
                </td>
              )}
              <td><button onClick={() => onUserSelect(user)}>Выбрать</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
