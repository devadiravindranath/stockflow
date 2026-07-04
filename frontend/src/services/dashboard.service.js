import api from './api';

const getStats = async () => {
  return await api.get('/dashboard/stats');
};

const dashboardService = {
  getStats
};

export default dashboardService;
