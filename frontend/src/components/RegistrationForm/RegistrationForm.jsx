import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerUser from '../../redux/usersActions';

import './RegistrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password length
    if (formData.password.length < 6) {
      setError('Пароль должен быть длиной не менее 6 символов');
      return;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(formData.password)) {
      setError('Пароль должен содержать хотя бы одну заглавную букву');
      return;
    }

    // Check for at least one number
    if (!/\d/.test(formData.password)) {
      setError('Пароль должен содержать хотя бы одну цифру');
      return;
    }

    // Check for at least one special symbol
    if (!/[@$!%*?&]/.test(formData.password)) {
      setError('Пароль должен содержать хотя бы один специальный символ');
      return;
    }

    const registrationResult = await registerUser(formData);

    if (registrationResult.success) {
      navigate('/login');
    } else {
      setError(registrationResult.error);
    }
  };

  return (
    <form  className="register-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <label>
        Логин:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="input-field"
        />
      </label>
      <br />
      <label>
        Имя и Фамилия:
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="input-field"
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
        />
      </label>
      <br />
      <label>
        Пароль:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
        />
      </label>
      <br />
      <button type="submit" className="submit-button">Зарегистрироваться</button>
    </form>
  );
};

export default RegistrationForm;
