import api from './api';

export const fetchPuestos = async () => {
  try {    
    const response = await api.get('/place/');
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener puestos:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

// Función adicional para obtener detalles de un puesto
export const fetchPuestoById = async (id) => {
  try {
    const response = await api.get(`/place/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener puesto ${id}:`, error);
    throw error;
  }
};

export const getPuestosByUser = async (userId) => {
  try {
    const response = await api.get(`/place/user_places/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo puestos del trabajador:", error);
    return [];
  }
};

export const assignUserToPlace = async (userId, placeId) => {
  try {
    const response = await api.post(`/place/add_user_to_place/${userId}/${placeId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error asignando puesto:", error.response?.data || error);
    return { success: false, error: error.response?.data };
  }
};

export const deletePuesto = async (placeId) => {
  try {
    const response = await api.delete(`/place/${placeId}`);
    console.log(`✅ Puesto ${placeId} borrado:`, response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ Error borrando puesto ${placeId}:`, error.response?.data || error);
    return { success: false, error: error.response?.data };
  }
};
