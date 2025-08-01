import api from './api';

export const fetchServices = async () => {
  try {
    const response = await api.get('/service/');
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener servicios:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const deleteServicio = async (serviceId) => {
  try {
    const response = await api.delete(`/service/${serviceId}`);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ Error borrando servicio ${serviceId}:`, error.response?.data || error);
    
    return { success: false, error: error.response?.data };
  }
};
