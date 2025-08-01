import { useEffect, useState } from "react";
import { getNextTurn, cerrarTurno } from "../api/turno";
import { fetchPuestoById, getPuestosByUser } from "../api/puestos";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function WorkerPage() {
  const [puestos, setPuestos] = useState([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);
  const [turnoActual, setTurnoActual] = useState(null);
  const [turnoCerrado, setTurnoCerrado] = useState(false);
  const [message, setMessage] = useState(null);
  const [puestoNombre, setPuestoNombre] = useState("");
  const [reload, setReload] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPuestosConNombre = async () => {
        try {
        const userId = localStorage.getItem("user_id");
        const token = localStorage.getItem("access_token");

        // 🔍 DEBUG: Ver qué datos se están usando
        console.log("🟡 DEBUG - ID del usuario que se está usando:", userId);
        console.log("🟡 DEBUG - Token que se está enviando:", token ? token.slice(0, 20) + "..." : "NO TOKEN");

        const puestosAsignados = await getPuestosByUser(userId);
        console.log("📥 Puestos asignados desde el backend:", puestosAsignados);

        if (!puestosAsignados || puestosAsignados.length === 0) {
            console.log("⚠️ No hay puestos asignados para este usuario");
            setPuestos([]);
            return;
        }

        const puestosConNombre = await Promise.all(
            puestosAsignados.map(async (p) => {
            const puestoInfo = await fetchPuestoById(p.place_id);
            console.log(`📥 Nombre del puesto ${p.place_id}:`, puestoInfo.place_name);

            return {
                ...p,
                place_name: puestoInfo.place_name || "Sin nombre",
            };
            })
        );

        console.log("✅ Puestos finales con nombre:", puestosConNombre);
        setPuestos(puestosConNombre);

        } catch (err) {
        console.error("❌ Error cargando puestos y nombres:", err);
        setMessage("Error al cargar los puestos.");
        }
    };

    fetchPuestosConNombre();
    }, []);

  const handleAsignarTurno = async (placeId) => {
    try {
      const userId = localStorage.getItem("user_id");
      const turno = await getNextTurn(userId, placeId);

      if (turno.success) {
        setTurnoActual(turno.data);
        setTurnoCerrado(false);
        setPuestoSeleccionado(placeId);

        const puesto = await fetchPuestoById(placeId);
        setPuestoNombre(puesto.place_name);
        localStorage.setItem("turno_listo", "true");
      } else {
        setTurnoActual(null);
        setPuestoSeleccionado(placeId);
        setMessage(null);
      }
    } catch (err) {
      console.error("❌ Error asignando turno", err);
      setMessage("Ocurrió un error al asignar turno.");
    }
  };

  const handleCerrarTurno = async () => {
    try {
      if (!turnoActual) return;

      const userId = localStorage.getItem("user_id");
      await cerrarTurno(userId, turnoActual.turn_id);

      setMessage(`✅ Turno ${turnoActual.turn_name} cerrado.`);
      setTurnoCerrado(true);
      localStorage.setItem("turno_listo", "false");
    } catch (err) {
      console.error("❌ Error cerrando turno", err);
      setMessage("Ocurrió un error al cerrar el turno.");
    }
  };

  const handleSiguienteTurno = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const turno = await getNextTurn(userId, puestoSeleccionado);

      if (turno.success) {
        setTurnoActual(turno.data);
        setTurnoCerrado(false);
      } else {
        setMessage("No hay más turnos activos.");
        setTurnoActual(null);
      }
    } catch (err) {
      console.error("❌ Error asignando siguiente turno", err);
      setMessage("Ocurrió un error al obtener el siguiente turno.");
    }
  };

  const handleVolver = () => {
    localStorage.setItem("turno_listo", "false");
    setTurnoActual(null);
    setTurnoCerrado(false);
    setPuestoSeleccionado(null);
    setReload(prev => !prev);
  };

  return (
    <div className="page-wrapper">
        <LogoutButton />
        {/* 🔵 TÍTULO */}
        <h1 className="page-title">🎯 Panel de Trabajador</h1>

        {/* 🚨 MENSAJES */}
        {message && <div style={{ color: '#e74c3c', marginBottom: '1rem' }}>{message}</div>}

        {/* 🔹 SELECCIONAR PUESTO */}
        {!puestoSeleccionado && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h2>Selecciona tu puesto:</h2>
            {puestos.length === 0 ? (
            <p>No tienes puestos asignados.</p>
            ) : (
            puestos.map((puesto) => (
                <button
                key={puesto.place_id}
                className="btn"
                style={{ margin: '10px' }}
                onClick={() => handleAsignarTurno(puesto.place_id)}
                >
                {puesto.place_name}
                </button>
            ))
            )}
        </div>
        )}

        {/* 📝 TURNO ACTUAL */}
        {puestoSeleccionado && turnoActual && (
        <div>
            <h2 className="page-title" style={{ fontSize: '1.8rem' }}>📝 Atendiendo Turno</h2>

            <div className="turno-card">
            <p><strong>Turno:</strong> {turnoActual.turn_name}</p>
            <p><strong>Prioridad:</strong> {turnoActual.turn_priority === "H" ? "Alta" : turnoActual.turn_priority === "M" ? "Media" : "Baja"}</p>
            <p><strong>Usuario:</strong> {turnoActual.owner ? `ID: ${turnoActual.owner}` : "Sin dueño"}</p>
            <p><strong>Puesto:</strong> {puestoNombre || "-"}</p>
            <p className="text-gray-500 text-sm">
                Creado: {new Date(turnoActual.date_created).toLocaleString()}
            </p>

            {/* 🔘 BOTONES DE ACCIÓN */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-gray" onClick={handleVolver}>
                🔙 Volver
                </button>

                <button className="btn btn-danger" onClick={handleCerrarTurno}>
                ✅ Cerrar
                </button>

                <button
                className="btn btn-next"
                style={{ backgroundColor: turnoCerrado ? '#27ae60' : '#bdc3c7', cursor: turnoCerrado ? 'pointer' : 'not-allowed' }}
                disabled={!turnoCerrado}
                onClick={handleSiguienteTurno}
                >
                ⏭ Siguiente
                </button>
            </div>
            </div>
        </div>
        )}

        {/* 🚫 NO HAY TURNOS ACTIVOS */}
        {puestoSeleccionado && !turnoActual && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h2 style={{ color: '#e74c3c' }}>🚫 No hay turnos activos en este puesto</h2>
            <button className="btn btn-gray" style={{ marginTop: '1rem' }} onClick={handleVolver}>
            🔙 Volver
            </button>
        </div>
        )}
    </div>
    );
}
