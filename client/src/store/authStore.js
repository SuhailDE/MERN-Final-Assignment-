import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      async login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        set({ token: data.token, user: data.user });
        return data.user;
      },
      async register(payload) {
        const { data } = await api.post('/auth/register', payload);
        set({ token: data.token, user: data.user });
        return data.user;
      },
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'kormohub-auth' }
  )
);
