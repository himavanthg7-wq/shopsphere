import axiosClient from './axiosClient';

export const categoryApi = {
  getCategories: () => axiosClient.get('/categories'),
  getCategoryById: (id) => axiosClient.get(`/categories/${id}`),
};
