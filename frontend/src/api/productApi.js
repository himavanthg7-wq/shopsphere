import axiosClient from './axiosClient';

export const productApi = {
  getProducts: (params) => axiosClient.get('/products', { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  getProductBySlug: (slug) => axiosClient.get(`/products/slug/${slug}`),
  getFeatured: () => axiosClient.get('/products/featured'),
  getBestSellers: () => axiosClient.get('/products/best-sellers'),
  getNewArrivals: () => axiosClient.get('/products/new-arrivals'),
  getRelated: (id) => axiosClient.get(`/products/${id}/related`),
};
