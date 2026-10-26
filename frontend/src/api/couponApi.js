import axiosClient from './axiosClient';

export const couponApi = {
  getActiveCoupons: () => axiosClient.get('/coupons/active'),
  validateCoupon: (code, amount) =>
    axiosClient.get('/coupons/validate', { params: { code, amount } }),
};
