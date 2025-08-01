import React, { useEffect, useState } from 'react';
import { getTurnoActivo } from '../api/turno';
import { fetchPuestoById } from '../api/puestos';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Turno = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id: stateUserId } = location.state || {};
  const user_id = stateUserId || localStorage.getItem("user_id");
  const [publicidad, setPublicidad] = useState(null);

  const [turno, setTurno] = useState(null);
  const [puesto, setPuesto] = useState(null);
  const [expectedTime, setExpectedTime] = useState(null);
  const [notified, setNotified] = useState(false);
  const [turnoCerrado, setTurnoCerrado] = useState(false);
  const [contador, setContador] = useState(3);
  const [estadoTurno, setEstadoTurno] = useState("espera"); 

  useEffect(() => {
    const ad = localStorage.getItem("publicidad");
    console.log("📢 Publicidad cargada desde localStorage:", ad);
    if (ad) {
      setPublicidad(ad);
    }
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchExpectedTime = async () => {
      console.log("⏳ Ejecutando fetchExpectedTime...");
      if (!user_id) {
        console.log("❌ No hay user_id, saliendo...");
        return;
      }

      const response = await getTurnoActivo(user_id);
      console.log("📥 Respuesta de getTurnoActivo:", response);

      // 🚨 Caso: API responde que NO hay turno activo
      if (response.success && response.data?.message === "No tiene turno activo.") {
        console.log("✅ El turno ya fue cerrado");

        setTurnoCerrado(true);
        clearInterval(intervalId); // ✋ detenemos el polling

        // ⏳ Iniciamos contador regresivo
        let count = 3;
        setContador(count);
        const countdown = setInterval(() => {
          count -= 1;
          setContador(count);
          if (count === 0) {
            clearInterval(countdown);
            navigate("/puestos");
          }
        }, 1000);

        return;
      }

      if (response.success && response.data) {
        const data = response.data;
        setTurno(data);

        if (data.expected_attendacy_time) {
          setExpectedTime(data.expected_attendacy_time);
        }

        if (data.place_id) {
          try {
            const puestoData = await fetchPuestoById(data.place_id);
            setPuesto(puestoData);
          } catch (error) {
            console.error("❌ Error al obtener el puesto:", error);
          }
        }

        if (data.is_next && !notified) {
          const turnoListo = localStorage.getItem("turno_listo");
          if (turnoListo === "true") {
            Swal.fire({
              title: "¡Es tu turno!",
              text: "Por favor dirígete al lugar de atención.",
              icon: "info",
              confirmButtonText: "Aceptar"
            });
            setNotified(true);
          } else {
            console.log("⏳ El turno aún no ha sido activado por el trabajador.");
          }
        }
      }
    };

    fetchExpectedTime();
    intervalId = setInterval(fetchExpectedTime, 10000);

    return () => clearInterval(intervalId);
  }, [user_id, notified, navigate]);

  return (
    <div className="page-wrapper-horizontal">
      {/* 📢 PUBLICIDAD IZQUIERDA */}
      {publicidad && (
        <div className="ad-side">
          <img src={publicidad} alt="Publicidad Izquierda" className="ad-image-vertical" />
        </div>
      )}

      {/* 🎯 CONTENIDO PRINCIPAL */}
      <div style={styles.mainContent}>
        {turnoCerrado ? (
          <>
            <h1 style={styles.closedTitle}>✅ Turno cerrado, ya fue atendido.</h1>
            <p style={styles.redirectText}>Serás redirigido en {contador}...</p>
          </>
        ) : (
          <>
            <h1 style={styles.title}>Este es tu turno:</h1>
            <div style={styles.infoBox}>
              <p><strong>Lugar:</strong> {puesto ? puesto.place_name : 'Cargando...'}</p>
              <p><strong>Número de Turno:</strong> {turno ? turno.turn_name : 'Cargando...'}</p>
              <p><strong>Prioridad:</strong> {turno ? turno.turn_priority : 'Cargando...'}</p>
              <p>
                <strong>Tiempo estimado de atención:</strong>{' '}
                {expectedTime !== null ? `${expectedTime} minutos` : 'No disponible'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* 📢 PUBLICIDAD DERECHA */}
      {publicidad && (
        <div className="ad-side">
          <img src={publicidad} alt="Publicidad Derecha" className="ad-image-vertical" />
        </div>
      )}
    </div>
  );
};

const styles = {
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adSide: {
    width: '220px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adImageVertical: {
    maxWidth: '180px',   
    maxHeight: '90vh', 
    width: 'auto',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    objectFit: 'contain',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  closedTitle: {
    fontSize: '2.5rem',
    color: '#e74c3c',
    marginBottom: '10px',
    textAlign: 'center',
  },
  redirectText: {
    fontSize: '1.5rem',
    color: '#34495e',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    fontSize: '1.2rem',
    color: '#34495e',
    lineHeight: '2',
  }
};

export default Turno;