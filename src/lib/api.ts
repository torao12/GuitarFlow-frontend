import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://3.213.255.41:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Formato exacto requerido por el Backend
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🚀 Enviando Header: Authorization: Bearer " + token.substring(0, 10) + "...");
    } else {
      console.warn("⚠️ No hay token disponible para esta petición protegida.");
    }
  }
  return config;
});

export const guitarFlowApi = {
  auth: {
    register: async (data: any) => {
      const res = await apiClient.post('/auth/register', {
        full_name: data.fullName,
        email: data.email,
        password: data.password
      });
      if (res.data.token) localStorage.setItem('auth_token', res.data.token);
      return res.data;
    },
    login: async (creds: any) => {
      const res = await apiClient.post('/auth/login', creds);
      if (res.data.token) localStorage.setItem('auth_token', res.data.token);
      return res.data;
    },
    logout: () => localStorage.removeItem('auth_token'),
  },
  getKeys: () => apiClient.get('/keys'),
  getChordsByKey: (id: number) => apiClient.get(`/keys/${id}/chords`),
  createProgression: (data: any) => apiClient.post('/progressions', data),
};