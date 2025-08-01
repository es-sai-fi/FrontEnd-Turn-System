import React, { useState, useEffect } from 'react';
import { createPlace } from '../api/crearPuestos';
import { createService } from '../api/crearServicio';
import { createEmployee } from '../api/crearEmpleados';
import { fetchEmpleados } from '../api/crearEmpleados';
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import Swal from 'sweetalert2';
import { fetchPuestos, deletePuesto, assignUserToPlace } from '../api/puestos'; 

const Crear = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState("");
  const [selectedPuesto, setSelectedPuesto] = useState("");
  const navigate = useNavigate();
  const [publicidad, setPublicidad] = useState(localStorage.getItem("publicidad") || null);
  const [formData, setFormData] = useState({
    place_name: '',
    service_name: '',
    service_desc: ''
  });

  const handleOpenAssignModal = () => {
    setShowAssignModal(true);
  };

  const handleAssign = async () => {
    if (!selectedEmpleado || !selectedPuesto) {
      alert("Debes seleccionar un empleado y un puesto");
      return;
    }
  const result = await assignUserToPlace(selectedEmpleado, selectedPuesto);
    if (result.success) {
      Swal.fire({
                title: `¡Listo!`,
                text: 'Puesto asignado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                customClass: {
                  popup: 'swal2-popup',
                  title: 'swal2-title',
                  confirmButton: 'swal2-confirm'
                }
              });
      setShowAssignModal(false);
      setSelectedEmpleado("");
      setSelectedPuesto("");
    } else {
      alert("❌ Error asignando puesto");
    }
  };

  const handlePublicidadUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("publicidad", reader.result);  // Guarda en localStorage
        setPublicidad(reader.result);  // Actualiza el estado
      };
      reader.readAsDataURL(file); // Convierte a base64 para que pueda mostrarse
    }
  };

  const handleDeletePublicidad = () => {
    localStorage.removeItem("publicidad");
    setPublicidad(null);
  };

  // 🔥 Nuevo estado para empleados
  const [employeeData, setEmployeeData] = useState({
    email: '',
    password: '',
    name: '',
    last_name: '',
    age: '',
    condition: ''
  });

  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const data = await fetchEmpleados();
        setEmpleados(data);
        console.log("📥 Empleados recibidos:", data); 
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      }
    };
    obtenerEmpleados();
  }, []);

  const [puestos, setPuestos] = useState([]);

  useEffect(() => {
    const obtenerPuestos = async () => {
      try {
        const data = await fetchPuestos();
        setPuestos(data);
      } catch (error) {
        console.error('Error al obtener los puestos:', error);
      }
    };
    obtenerPuestos();
  }, []);

  const handleButtonClick = (formType) => {
    setCurrentForm(formType);
    setShowModal(true);
  };

  const handleDelete = async (placeId) => {
    if (window.confirm("¿Estás seguro de que quieres borrar este puesto?")) {
      const result = await deletePuesto(placeId);
      if (result.success) {
        Swal.fire({
                  title: `¡Listo!`,
                  text: 'Puesto eliminado correctamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    confirmButton: 'swal2-confirm'
                  }
                });
        fetchPuestos();
      } else {
        alert("❌ Error borrando puesto: " + (result.error?.message || "Error desconocido"));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentForm === 'employee') {
      setEmployeeData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentForm === 'place') {
        // 1️⃣ Primero creamos el servicio
        const newService = await createService({
          service_name: formData.service_name,
          service_desc: formData.service_desc
        });

        console.log("✅ Servicio creado:", newService);

        // 2️⃣ Luego creamos el puesto con el service_id que acabamos de obtener
        await createPlace({
          place_name: formData.place_name,
          service_id: newService.service_id
        });

        Swal.fire({
                  title: `¡Listo!`,
                  text: 'Puesto y Servicio Creados con Éxito',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    confirmButton: 'swal2-confirm'
                  }
                });
      } 
      else if (currentForm === 'employee') {
        // Si es empleado, no cambiamos nada
        const response = await createEmployee(employeeData);
        if (response.success) {
          alert("✅ Empleado creado con éxito!");
        } else {
          alert("❌ Error: " + JSON.stringify(response.error));
        }
      }

      // ✅ Cerramos modal y limpiamos datos
      setShowModal(false);
      setFormData({ place_name: '', service_name: '', service_desc: '' });
      setEmployeeData({ email: '', password: '', name: '', last_name: '', age: '', condition: '' });

    } catch (error) {
      alert(`❌ Error al crear: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="admin-wrapper">
      <LogoutButton />
      <h1 className="admin-heading">Panel de Administración</h1>

      {/* 📊 BOTÓN PARA VER ESTADÍSTICAS */}
      <div className="button-group">
        <button className="btn" onClick={() => navigate('/PlaceStats')}>
          📊 Ver Estadísticas
        </button>
      </div>

      {/* 📌 Botones de acciones principales */}
      <div className="button-group">
        <button 
          className="action-button"
          onClick={() => handleButtonClick('place')}
        >
          Crear Puesto
        </button>

        <button 
          className="action-button"
          onClick={() => handleButtonClick('employee')}
        >
          Crear Empleado
        </button>

        {/* 🚀 NUEVO BOTÓN PARA ABRIR EL MODAL */}
        <button 
          className="action-button"
          onClick={handleOpenAssignModal}
        >
          Asignar Puesto
        </button>
      </div>

      {/* 📢 Sección para agregar publicidad */}
      <div className="puestos-container">
        <h2 className="puestos-heading">📢 Agregar Publicidad</h2>

        {/* Input para seleccionar imagen */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handlePublicidadUpload}
          className="form-input"
        />

        {/* Mostrar vista previa si ya hay publicidad guardada */}
        {publicidad && (
          <div style={{ marginTop: '1rem' }}>
            <img 
              src={publicidad} 
              alt="Publicidad actual" 
              style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
            />
            <button 
              className="delete-button"
              onClick={handleDeletePublicidad}
            >
              🗑 Eliminar Publicidad
            </button>
          </div>
        )}
      </div>

      {/* 📌 MODAL PARA ASIGNAR PUESTO */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setShowAssignModal(false)}
            >
              ×
            </button>

            <h2 className="admin-heading" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              Asignar Puesto a Empleado
            </h2>

            {/* Select de empleados */}
            <div className="form-group">
              <label className="form-label">Selecciona un empleado:</label>
              <select 
                value={selectedEmpleado} 
                onChange={(e) => setSelectedEmpleado(e.target.value)}
                className="form-input"
              >
                <option value="">-- Selecciona un empleado --</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.name} {empleado.last_name} ({empleado.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Select de puestos */}
            <div className="form-group">
              <label className="form-label">Selecciona un puesto:</label>
              <select 
                value={selectedPuesto} 
                onChange={(e) => setSelectedPuesto(e.target.value)}
                className="form-input"
              >
                <option value="">-- Selecciona un puesto --</option>
                {puestos.map((puesto) => (
                  <option key={puesto.place_id} value={puesto.place_id}>
                    {puesto.place_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón para asignar */}
            <button 
              type="button" 
              className="submit-button" 
              onClick={handleAssign}
            >
              ✅ Asignar
            </button>
          </div>
        </div>
      )}

      {/* 📌 Modal de creación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            
            <h2 className="admin-heading" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              {currentForm === 'place' 
                ? 'Nuevo Puesto + Servicio' 
                : 'Nuevo Empleado'}
            </h2>
            
            {/* 📌 Formulario dinámico */}
            <form onSubmit={handleSubmit}>
              {/* 🔹 Formulario para Puesto */}
              {currentForm === 'place' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nombre del Puesto:</label>
                    <input
                      type="text"
                      name="place_name"
                      value={formData.place_name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nombre del Servicio:</label>
                    <input
                      type="text"
                      name="service_name"
                      value={formData.service_name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción:</label>
                    <textarea
                      name="service_desc"
                      value={formData.service_desc}
                      onChange={handleInputChange}
                      className="form-textarea"
                      required
                    />
                  </div>
                </>
              )}

              {/* 🔹 Formulario para Empleado */}
              {currentForm === 'employee' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nombre:</label>
                    <input
                      type="text"
                      name="name"
                      value={employeeData.name || ""}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido:</label>
                    <input
                      type="text"
                      name="last_name"
                      value={employeeData.last_name || ""}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Correo:</label>
                    <input
                      type="email"
                      name="email"
                      value={employeeData.email || ""}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contraseña:</label>
                    <input
                      type="password"
                      name="password"
                      value={employeeData.password || ""}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Edad:</label>
                    <input
                      type="number"
                      name="age"
                      value={employeeData.age || ""}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">¿Activo?</label>
                    <select
                      name="condition"
                      value={employeeData.condition || ""}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value={true}>Sí</option>
                      <option value={false}>No</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="submit-button">
                Crear
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 📌 Lista de Puestos */}
      <div className="puestos-container">
        <h2 className="puestos-heading">📍 Lista de Puestos</h2>
        <ul className="puestos-list">
          {puestos.map((puesto) => (
            <li key={puesto.place_id} className="puesto-item">
              <strong>Puesto:</strong> {puesto.place_name}<br />
              <strong>Servicio:</strong> {puesto.service?.service_name}<br />
              <strong>Descripción:</strong> {puesto.service?.service_desc}

              {/* 📌 Botón de borrar */}
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(puesto.place_id)}
                >
                  🗑 Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 📌 Lista de Empleados */}
      <div className="puestos-container" style={{ marginTop: '2rem' }}>
        <h2 className="puestos-heading">👥 Lista de Empleados</h2>
        <ul className="puestos-list">
          {empleados.map((empleado) => (
            <li key={empleado.id} className="puesto-item">
              <strong>Nombre:</strong> {empleado.name} {empleado.last_name}<br />
              <strong>Correo:</strong> {empleado.email}<br />
              <strong>Edad:</strong> {empleado.age} años<br />
              <strong>Activo:</strong> {empleado.condition ? "✅ Sí" : "❌ No"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Crear;