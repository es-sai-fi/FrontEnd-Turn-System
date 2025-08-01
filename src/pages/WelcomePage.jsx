import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper welcome-wrapper">
      <h1 className="welcome-heading">Bienvenido a nuestro sistema</h1>
      <p className="welcome-subheading">
        Gestiona tus turnos y servicios fácilmente
      </p>
      <div className="welcome-button-container">
        <button className="btn-primary" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </button>
        <button className="btn-outline" onClick={() => navigate('/registro')}>
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;