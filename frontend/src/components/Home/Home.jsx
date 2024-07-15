import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home () {
  return (
    <div className="home-container">
      <h1 className="title">My Cloud</h1>
      <p className="description">Сервис хранения файлов</p>
      <Link to="/registration" className="link">Регистрация</Link>
      <br />
      <Link to="/login" className="link">Вход</Link>
    </div>
  );
}

export default Home;
