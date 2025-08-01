import api from './api';

export const getGlobalStats = async () => {
  try {
    const res = await api.get('/stats/');
    const stats = res.data[0];

    
    console.log("Demografía recibida:", stats.attended_users_demographic_distribution);
    console.log("Prioridades recibidas:", stats.attended_users_priority_distribution);
    console.log("Estadísticas por lugar recibidas:", stats.place_statistics);

    return {
      userDemographics: stats.attended_users_demographic_distribution,
      priorityDistribution: stats.attended_users_priority_distribution,
      placeStatistics: stats.place_statistics,
    };
  } catch (error) {
    console.error("Error en getGlobalStats:", error.response?.data || error.message);
    throw error;
  }
};
