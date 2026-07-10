import api from './axiosConfig';

export const getDashboardStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data.data;
};

// Admin-only: returns ALL products including deactivated ones (isActive:false).
// Distinct from productService.getProducts(), which only returns active
// products for the public storefront.
export const getAllProducts = async (params = {}) => {
  const { data } = await api.get('/admin/products', { params });
  return data.data; // { products, total, page, pages }
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
  return data.data.product;
};

// Also used for reactivation - PUT with { isActive: true } flips the flag
// back on via the existing Object.assign(product, req.body) in
// productController.updateProduct. No separate reactivate endpoint needed.
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data.data.product;
};

// Soft-delete only: backend sets isActive:false, never removes the document
// (see Backend/src/controllers/productController.js -> deleteProduct).
export const deactivateProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data.data;
};