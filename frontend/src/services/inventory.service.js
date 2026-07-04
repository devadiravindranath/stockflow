import api from './api';

const getAll = async () => {
  return await api.get('/inventory');
};

const create = async (data) => {
  return await api.post('/inventory', data);
};

const inventoryService = {
  getAll,
  create,
};

export default inventoryService;
