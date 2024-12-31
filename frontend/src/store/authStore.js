import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  setError: (error) => set({ error }),

  signup: async (name, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    if (!name || !email || !password || !confirmPassword) {
      set({ isLoading: false });
      return { success: false, message: "All fields are required!" };
    }
    if (password !== confirmPassword) {
      set({ isLoading: false });
      return { success: false, message: "Passwords are not matched!" };
    }
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, message: "User created successful!" };
    } catch (error) {
      set({
        isLoading: false,
      });
      return {
        success: false,
        message: error.response.data.message || "Error signing up",
      };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    if (!email || !password) {
      set({ isLoading: false });
      return { success: false, message: "All fields are required!" };
    }
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, message: "User logged in successful!" };
    } catch (error) {
      set({
        isLoading: false,
      });
      return {
        success: false,
        message: error.response.data.message || "Error logging in",
      };
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/verify_email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, message: "Email verified successful!" };
    } catch (error) {
      set({
        isLoading: false,
      });
      return {
        success: false,
        message: error.response.data.message || "Error verifying email",
      };
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/check_auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
      });
      return {
        success: false,
        message: error.response.data.message || "Error verifying email",
      };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/forgot_password`, {
        email,
      });
      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({
        isLoading: false,
      });
      return {
        success: false,
        message: error.response.data.message || "Error forgetting password",
      };
    }
  },

  resetPassword: async (token, password, confirmPassword) => {
    set({ isLoading: true });
    if (password !== confirmPassword) {
      set({ isLoading: false });
      return { success: false, message: "Passwords are not matched!" };
    }
    try {
      const response = await axios.post(`${API_URL}/reset_password/${token}`, {
        password,
      });
      set({ isLoading: true, message: response.data.message });
    } catch (error) {
      set({
        isLoading: false,
      });
      return {
        success: false,
        message: error.response.data.message || "Error resetting password",
      };
    }
  },
}));
