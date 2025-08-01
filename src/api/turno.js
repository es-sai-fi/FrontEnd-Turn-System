import api from './api';

export const crearTurno = async (turnoData) => {
  try {
    const response = await api.post('/turn/', {
      owner: turnoData.user_id,  
      place_id: turnoData.place_id
    });
    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error creando turno:", error.response?.data || error);
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};


export const getTurnoActivo = async (userId) => {
  try {
    const response = await api.get(`/turn/user_active_turn/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

export const getAllTurnos = async () => {
  try {
    const response = await api.get('/turn/');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

export const cerrarTurno = async (userId, turnoId) => {
  try {
    const response = await api.get(`/turn/close_turn/${userId}/${turnoId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error al cerrar turno:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || "Error en cerrarTurno" };
  }
};

export const cancelarTurno = async (turnoId) => {
  try {
    const response = await api.get(`/turn/cancel_turn/${turnoId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
    };
  }
};

export const getNextTurn = async (userId, placeId) => {
  try {
    const response = await api.get(`/turn/next_turn/${userId}/${placeId}`);
    console.log("✅ Siguiente turno recibido:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al obtener el siguiente turno:", error.response?.data || error);
    return {
      success: false,
      error: error.response?.data || "Error al obtener el siguiente turno",
    };
  }
};
