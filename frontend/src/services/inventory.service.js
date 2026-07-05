import api from './api';

const getAll = async () => {
  return await api.get('/inventory');
};

const inventoryService = {
  getAll,
};

export default inventoryService;
