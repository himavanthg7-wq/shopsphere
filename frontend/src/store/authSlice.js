import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
let user = null;
try {
  user = userStr ? JSON.parse(userStr) : null;
} catch (e) {
  user = null;
}

const initialState = {
  token: token || null,
  user: user,
  isAuthenticated: !!token,
  isAdmin: user?.roles?.includes('ROLE_ADMIN') || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, id, firstName, lastName, email, roles } = action.payload;
      state.token = token;
      state.user = { id, firstName, lastName, email, roles };
      state.isAuthenticated = true;
      state.isAdmin = roles?.includes('ROLE_ADMIN') || false;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
