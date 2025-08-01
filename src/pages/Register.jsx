import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/register';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();  

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    last_name: '',
    age: '',
    condition: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(formData);
    if (result.success) {
      Swal.fire({
                title: `¡Registro Existoso!`,
                text: 'Ya puedes iniciar sesión!',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                customClass: {
                  popup: 'swal2-popup',
                  title: 'swal2-title',
                  confirmButton: 'swal2-confirm'
                }
              });
      navigate('/login');
    } else {
      alert("Error en el registro ❌");
      console.error(result.error);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Registro</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Edad"
          value={formData.age}
          onChange={handleChange}
          className="input"
          required
        />
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="conditions"
            checked={formData.conditions}
            onChange={handleChange}
            style={{ marginRight: '10px' }}
          />
          ¿Tiene alguna condición de discapacidad?
        </label>

        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;