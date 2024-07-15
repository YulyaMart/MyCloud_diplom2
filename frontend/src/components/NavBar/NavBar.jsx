import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/usersActions';
import './NavBar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const currentuser = localStorage.getItem('currentuser');
  console.log(currentuser)
  return (
    <div className="navbar">
      <div className="current-username">Облачное хранилище пользователя: {currentuser} </div>
      <div className="logout-link" onClick={handleLogout}>
        Выйти
      </div>
    </div>
  );
};

export default Navbar;
