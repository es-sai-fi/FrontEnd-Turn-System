import api from './api';

export const createPlace = async ({ place_name, service_id }) => {
  try {
    console.log('Attempting to create place with:', { place_name, service_id });
    console.log('Request URL:', api.defaults.baseURL + '/api/places/');

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('Datos que se enviarán:', {
      place_name,
      service_id
    });

    const response = await api.post(
      'place/create_place',
      {
        place_name,
        service_id,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Place created successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error creating place:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    throw error; 
  }
};