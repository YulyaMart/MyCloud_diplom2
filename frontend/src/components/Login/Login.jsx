import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  return (
    <div className='login-container'>
      <h2>Вход</h2>
      <LoginForm />
      <p className='link-register'>
        Нет аккаунта? <Link to="/registration">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
}

export default Login;
