import axiosClient from './axiosClient';

export const cartApi = {
  getCart: (couponCode) => axiosClient.get('/cart', { params: { couponCode } }),
  addToCart: (productId, quantity = 1) => axiosClient.post('/cart/items', { productId, quantity }),
  updateCartItem: (itemId, quantity) => axiosClient.put(`/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosClient.delete('/cart'),
};
