import api from './api';

const getAllProducts = async () => {
  return await api.get('/products');
};

const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};

const createProduct = async (productData) => {
  return await api.post('/products', productData);
};

const updateProduct = async (id, productData) => {
  return await api.put(`/products/${id}`, productData);
};

const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productService;
