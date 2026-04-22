import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  config.headers['x-user-id'] = '1'; // Cambiar dinámicamente con tu sistema de autenticación
  return config;
});

export const guitarFlowApi = {
  getKeys: () => api.get('/keys').then(res => res.data),
  getChordsByKey: (keyId: number) => api.get(`/keys/${keyId}/chords`).then(res => res.data),
  getProgressions: () => api.get('/progressions').then(res => res.data),
  createProgression: (data: { workTitle: string, baseKeyId: number, chordIds: number[] }) => 
    api.post('/progressions', data),
  transposeProgression: (id: number, semitonesShift: number, newTitle: string) =>
    api.post(`/progressions/${id}/transpose`, { semitonesShift, newTitle }),
  addFavorite: (id: number) => api.post(`/favorites/${id}`),
  removeFavorite: (id: number) => api.delete(`/favorites/${id}`),
};