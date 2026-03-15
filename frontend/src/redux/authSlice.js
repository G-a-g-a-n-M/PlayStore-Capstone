import { createSlice } from "@reduxjs/toolkit";
import authService from "../services/authService";

const initialState = {
  isLoggedIn: authService.isLoggedIn(),
  role: authService.getRole(),
  token: authService.getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
      state.name = null;
      state.email = null;
    },
  },
});

export const { loginSuccess, logoutUser } = authSlice.actions;

export default authSlice.reducer;
