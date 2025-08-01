import axios from 'axios';
import { API_URL } from './api';

const serviceApi = axios.create({
  baseURL: API_URL,
});

export const createService = async ({ service_name, service_desc }) => {
  try {
    console.log('Attempting to create service with:', { service_name, service_desc });
    console.log('Request URL:', serviceApi.defaults.baseURL + '/api/services/');

    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('Token:', token);
    const response = await serviceApi.post(
      'service/',
      {
        service_name,  
        service_desc, 
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Service created successfully:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error creating service:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    throw error; 
  }
};