import axiosClient from './axiosClient';

export const reviewApi = {
  getProductReviews: (productId, page = 0, size = 10) =>
    axiosClient.get(`/reviews/product/${productId}`, { params: { page, size } }),
  addReview: (data) => axiosClient.post('/reviews', data),
};
