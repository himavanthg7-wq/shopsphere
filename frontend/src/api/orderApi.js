import axiosClient from './axiosClient';

export const orderApi = {
  createOrder: (data) => axiosClient.post('/orders', data),
  verifyPayment: (data) => axiosClient.post('/orders/verify-payment', data),
  getMyOrders: () => axiosClient.get('/orders'),
  getOrderByNumber: (orderNumber) => axiosClient.get(`/orders/${orderNumber}`),
  cancelOrder: (orderId) => axiosClient.put(`/orders/${orderId}/cancel`),
};
