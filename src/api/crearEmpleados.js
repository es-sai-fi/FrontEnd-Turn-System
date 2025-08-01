import axios from 'axios';
import { API_URL } from './api';

const api = axios.create({
  baseURL: API_URL,
});

export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post('/user/employee', employeeData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Error creando empleado:", error.response?.data || error);
    return { success: false, error: error.response?.data || "Error al crear empleado" };
  }
};

export const fetchEmpleados = async () => {
  try {
    const response = await api.get("/user/employee");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener empleados:", error);
    throw error;
  }
};