import React from 'react';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import './Registration.css'
import { Link } from 'react-router-dom';

const Registration = () => {
  return (
    <div className='registrarion-container'>
      <h2>Регистрация</h2>
      <RegistrationForm />
      <p className='link-register'>
        Есть аккаунт? <Link to="/login">Логин</Link>
      </p>
    </div>
  );
}

export default Registration;
