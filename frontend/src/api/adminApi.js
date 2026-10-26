import axiosClient from './axiosClient';

export const adminApi = {
  getDashboardMetrics: () => axiosClient.get('/admin/dashboard'),
  getOrders: (page = 0, size = 15) => axiosClient.get('/admin/orders', { params: { page, size } }),
  updateOrderStatus: (orderId, data) => axiosClient.put(`/admin/orders/${orderId}/status`, data),

  createProduct: (data) => axiosClient.post('/admin/products', data),
  updateProduct: (id, data) => axiosClient.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),

  createCategory: (data) => axiosClient.post('/admin/categories', data),
  updateCategory: (id, data) => axiosClient.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axiosClient.delete(`/admin/categories/${id}`),

  getInventory: () => axiosClient.get('/admin/inventory'),
  updateInventory: (productId, quantity, reorderLevel) =>
    axiosClient.put(`/admin/inventory/${productId}`, null, { params: { quantity, reorderLevel } }),

  getCoupons: () => axiosClient.get('/admin/coupons'),
  createCoupon: (data) => axiosClient.post('/admin/coupons', data),
  updateCoupon: (id, data) => axiosClient.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => axiosClient.delete(`/admin/coupons/${id}`),

  getUsers: () => axiosClient.get('/admin/users'),
};
