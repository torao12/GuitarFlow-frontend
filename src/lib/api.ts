import axios from 'axios';

const API_BASE_URL = 'http://3.213.255.41:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de JWT obligatorio
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
  // --- AUTENTICACIÓN ---
  auth: {
    // Postman name: "Register"
    register: (data: any) => apiClient.post('/auth/register', {
      full_name: data.fullName,
      email: data.email,
      password: data.password
    }),
    // Postman name: "Login"
    login: (creds: any) => apiClient.post('/auth/login', creds),
    logout: () => localStorage.removeItem('auth_token'),
  },

  // --- CATÁLOGOS ---
  // Postman name: "Get Tonalidades (Keys)"
  getKeys: () => apiClient.get('/keys'),
  // Postman name: "Get Key By ID"
  getChordsByKey: (id: number) => apiClient.get(`/keys/${id}/chords`),

  // --- PROGRESIONES ---
  // Postman name: "Get Progressions"
  listProgressions: () => apiClient.get('/progressions'),
  
  // Postman name: "Post progression"
  createProgression: (data: { workTitle: string, baseKeyId: number, chordIds: number[] }) => 
    apiClient.post('/progressions', data),

  // Postman name: "Post Desplazar tono"
  transpose: (id: number, data: { semitonesShift: number, newTitle: string }) => 
    apiClient.post(`/progressions/${id}/transpose`, data),

  // --- FAVORITOS ---
  // Postman name: "Post Favoritos" -> POST /api/favorites/:id
  addFavorite: (id: number) => apiClient.post(`/favorites/${id}`),
  
  // Postman name: "Delete Favorito" -> DELETE /api/favorites/:id
  removeFavorite: (id: number) => apiClient.delete(`/favorites/${id}`),
};