import React, { useState } from 'react';
import { getLogin } from '../api/login';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await getLogin({ email, password });
      console.log('Respuesta completa del login:', data); // Depuración detallada
  
      // Verificación exhaustiva del token
      if (!data?.access) {
        console.error('Estructura inesperada:', data);
        throw new Error('El servidor no devolvió un token válido');
      }
  
      // Almacenamiento seguro
      localStorage.setItem('access_token', data.access);
      
      // Guardar refresh token si existe
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
  
      console.log('Token almacenado:', localStorage.getItem('access_token')); // Verificación
  
      // Manejo de datos de usuario
      if (data.user) {
        localStorage.setItem('role_id', data.user.role_id);
        localStorage.setItem('user_id', data.user.id); // Cambiado de user_id a id para consistencia
        localStorage.setItem('user_name', data.user.name);
        
        alert(`¡Bienvenido ${data.user.name}!`);
        
        const roleId = Number(data.user.role_id);
        console.log('Role ID:', roleId);
        
        // Navegación basada en roles
        if (roleId === 1) {
          navigate('/crear', { replace: true, state: { freshLogin: true } }); // Admin
        } else if (roleId === 3) {
          navigate('/trabajador', { replace: true, state: { freshLogin: true } }); // Trabajador
        } else {
          navigate('/puestos', { replace: true, state: { freshLogin: true } }); // Cliente
        }
      } else {
        navigate('/puestos', { replace: true });
      }
      
    } catch (error) {
      console.error('Error completo:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      setError(error.response?.data?.detail || 'Error al iniciar sesión');
      alert(error.response?.data?.detail || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="page-wrapper form-wrapper">
      <h1 className="page-title">Iniciar sesión</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;