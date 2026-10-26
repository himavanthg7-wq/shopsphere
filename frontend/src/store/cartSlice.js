import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../api/cartApi';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (couponCode, { rejectWithValue }) => {
  try {
    return await cartApi.getCart(couponCode);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  cartId: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
  discountAmount: 0,
  taxAmount: 0,
  shippingAmount: 0,
  totalAmount: 0,
  appliedCoupon: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartData: (state, action) => {
      return { ...state, ...action.payload, loading: false, error: null };
    },
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        return { ...state, ...action.payload, loading: false, error: null };
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCartData, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
