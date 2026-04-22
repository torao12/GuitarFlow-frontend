import axios from 'axios';

const API_BASE_URL = 'https://api-guitar.readflow.lat/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const guitarFlowApi = {
  auth: {
    register: async (data: any) => {
      const response = await apiClient.post('/auth/register', {
        full_name: data.fullName, // Mapeo de UI a Backend
        email: data.email,
        password: data.password
      });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    },

    login: async (creds: any) => {
      const response = await apiClient.post('/auth/login', creds);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    },

    logout: () => {
      localStorage.removeItem('auth_token');
    }
  },

  getKeys: () => apiClient.get('/keys'),
  getChordsByKey: (id: number) => apiClient.get(`/keys/${id}/chords`),

  listProgressions: () => apiClient.get('/progressions'),
  
  createProgression: (data: { workTitle: string, baseKeyId: number, chordIds: number[] }) => 
    apiClient.post('/progressions', data),


  transpose: (id: number, shift: number, newTitle: string) => 
    apiClient.post(`/progressions/${id}/transpose`, {
      semitonesShift: shift,
      newTitle: newTitle
    }),


  addFavorite: (id: number) => apiClient.post(`/favorites/${id}`),
  
  removeFavorite: (id: number) => apiClient.delete(`/favorites/${id}`),
};