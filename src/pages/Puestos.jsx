import React, { useState, useEffect } from 'react';
import { fetchPuestos } from '../api/puestos';
import { crearTurno } from '../api/turno';   
import { jwtDecode } from 'jwt-decode';    
import { useNavigate } from 'react-router-dom'; 

const Puestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    loadPuestos();
  }, []);

  const loadPuestos = async () => {
    setLoading(true);
    try {
      const data = await fetchPuestos();
      setPuestos(data);
    } catch (error) {
      console.error('Error al cargar puestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePedirTurno = async (placeId) => {
    try {
      const userId = localStorage.getItem("user_id");

      
      const turnoResponse = await crearTurno({
        user_id: userId,
        place_id: placeId
      }); 

      if (turnoResponse.success) {
        navigate("/turno", { state: { 
          turn_id: turnoResponse.data.turn_id,
           place_id: turnoResponse.data.place_id,
            user_id: userId 
          } 
        });
      } else {
        alert("No fue posible generar el turno");
      }
    } catch (err) {
      console.error("❌ Error pidiendo turno:", err);
      alert("Hubo un error al pedir el turno");
    }
  };

  return (
    <div className="page-wrapper">
      <h2 className="page-title">Puestos Disponibles</h2>

      {/* 🔥 Mensaje de éxito o error */}
      {message && <div className="alert-message">{message}</div>}

      {loading ? (
        <p className="loading-text">Cargando puestos...</p>
      ) : (
        <>
          {/* 📋 Tabla de puestos */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Servicio</th>
                  <th className="table-header">Descripción</th>
                  <th className="table-header">Acción</th>
                </tr>
              </thead>
              <tbody>
                {puestos.map((puesto) => {
                  const uniqueKey = puesto.id 
                    ? `puesto-${puesto.id}` 
                    : `puesto-${puesto.place_name}-${puesto.service?.id || 'no-service'}`;
                  
                  return (
                    <tr key={uniqueKey} className="table-row">
                      <td className="table-cell">{puesto.place_id || 'N/A'}</td>
                      <td className="table-cell">{puesto.place_name}</td>
                      <td className="table-cell">{puesto.service?.service_name || '-'}</td>
                      <td className="table-cell">{puesto.service?.description || '-'}</td>
                      <td className="table-cell">
                        <button 
                          className="btn-primary"
                          onClick={() => handlePedirTurno(puesto.place_id)}
                        >
                          Pedir turno
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Puestos;