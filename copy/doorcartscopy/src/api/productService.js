import api from './axiosConfig';

// GET /api/products?keyword=&category=&minPrice=&maxPrice=&sort=&page=&limit=
// Backend: controllers/productController.js -> getProducts
// Returns { products, total, page, pages } already unwrapped, matching the
// pattern every other service file uses (categoryService, cartService, etc).
export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data.data; // { products, total, page, pages }
};

// GET /api/products/:slug
// NOTE: the backend looks products up by their `slug` field (see
// models/Product.js), not by Mongo _id - always pass product.slug here,
// never product._id.
export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data.product;
};

// Admin-only, kept for parity with adminService.js which already exposes
// createProduct/deleteProduct - included here too in case a page imports
// updateProduct from productService instead.
export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.data.product;
};