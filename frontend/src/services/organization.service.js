import api from './api';

const createOrganization = async (name) => {
  return await api.post('/organizations', { name });
};

const getMyOrganization = async () => {
  return await api.get('/organizations/me');
};

const organizationService = {
  createOrganization,
  getMyOrganization
};

export default organizationService;
