import api from './api';

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      console.warn("⚠️ No hay refresh token en localStorage");
      return { success: false, message: "No hay token para invalidar" };
    }

    const response = await api.post('/user/logout', {
      refresh: refreshToken,
    });

    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("❌ Error en logout:", error.response?.data || error);
    return { success: false, message: "Error cerrando sesión" };
  }
};