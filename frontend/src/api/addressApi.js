import axiosClient from './axiosClient';

export const addressApi = {
  getAddresses: () => axiosClient.get('/addresses'),
  getAddressById: (id) => axiosClient.get(`/addresses/${id}`),
  createAddress: (data) => axiosClient.post('/addresses', data),
  updateAddress: (id, data) => axiosClient.put(`/addresses/${id}`, data),
  deleteAddress: (id) => axiosClient.delete(`/addresses/${id}`),
};
