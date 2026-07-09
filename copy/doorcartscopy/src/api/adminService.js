import api from './axiosConfig';

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data.data;
};

export const getAllOrders = async (params = {}) => {
  const { data } = await api.get('/orders', { params });
  return data.data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data.data;
};

export const confirmOrder = async (id) => {
  const { data } = await api.put(`/orders/${id}/confirm`);
  return data.data;
};

export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data.data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data.data;
};