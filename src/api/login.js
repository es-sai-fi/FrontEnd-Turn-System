import api from './api';

export const getLogin = async ({ email, password }) => {
  console.log('Attempting login with:', { email, password: password });
  console.log('Request URL:', api.defaults.baseURL + '/user/login');
  const response = await api.post('/user/login', {
    email,
    password,
  });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  localStorage.setItem('role_id', response.data.role_id);
  console.log('Datos de login:', response.data); 
  return response.data;
};
