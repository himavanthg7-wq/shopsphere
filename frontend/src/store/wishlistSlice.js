import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../api/wishlistApi';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    return await wishlistApi.getWishlist();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  wishlistId: null,
  products: [],
  totalItems: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistData: (state, action) => {
      return { ...state, ...action.payload, loading: false, error: null };
    },
    resetWishlist: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        return { ...state, ...action.payload, loading: false, error: null };
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setWishlistData, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
