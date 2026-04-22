import axios from 'axios';

const API_BASE_URL = 'http://3.213.255.41:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const guitarFlowApi = {
  auth: {
    register: (data: any) => apiClient.post('/auth/register', {
      full_name: data.fullName,
      email: data.email,
      password: data.password
    }),
    login: (creds: any) => apiClient.post('/auth/login', creds),
    logout: () => localStorage.removeItem('auth_token'),
  },

  getKeys: () => apiClient.get('/keys'),
  getChordsByKey: (id: number) => apiClient.get(`/keys/${id}/chords`),
  listProgressions: () => apiClient.get('/progressions'),
  createProgression: (data: any) => apiClient.post('/progressions', data),

  transpose: (id: number, shift: number, newTitle: string) => 
    apiClient.post(`/progressions/${id}/transpose`, {
      semitonesShift: shift,
      newTitle: newTitle
    }),

  addFavorite: (id: number) => apiClient.post(`/favorites/${id}`),
  removeFavorite: (id: number) => apiClient.delete(`/favorites/${id}`),
};