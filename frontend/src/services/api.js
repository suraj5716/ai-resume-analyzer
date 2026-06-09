import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh/`, { refresh: refreshToken })
          localStorage.setItem('access_token', res.data.access)
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  me: () => api.get('/auth/me/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  logout: (refresh_token) => api.post('/auth/logout/', { refresh_token }),
}

export const analyzerAPI = {
  upload: (formData) => api.post('/analyzer/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  analyzeText: (data) => api.post('/analyzer/analyze-text/', data),
  list: () => api.get('/analyzer/analyses/'),
  get: (id) => api.get(`/analyzer/analyses/${id}/`),
  delete: (id) => api.delete(`/analyzer/analyses/${id}/delete/`),
  saveResume: (data) => api.post('/analyzer/save/', data),
  getSavedResume: (id) => api.get(`/analyzer/saved/${id}/`),
  updateSavedResume: (id, data) => api.patch(`/analyzer/saved/${id}/`, data),
  deleteSavedResume: (id) => api.delete(`/analyzer/saved/${id}/`),
}

export const builderAPI = {
  create: (data) => api.post('/builder/create/', data),
  list: () => api.get('/builder/list/'),
  get: (id) => api.get(`/builder/${id}/`),
  update: (id, data) => api.patch(`/builder/${id}/`, data),
  delete: (id) => api.delete(`/builder/${id}/`),
  generateBullets: (data) => api.post('/builder/generate-bullets/', data),
  optimize: (data) => api.post('/builder/optimize/', data),
  export: (id, format) => api.get(`/builder/${id}/export/${format}/`),
}

export const templatesAPI = {
  list: (params) => api.get('/templates/', { params }),
  get: (slug) => api.get(`/templates/${slug}/`),
  categories: () => api.get('/templates/categories/'),
  preview: (id) => api.get(`/templates/${id}/preview/`),
}

export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats/'),
  activity: () => api.get('/dashboard/activity/'),
}

export const paymentsAPI = {
  plans: () => api.get('/payments/plans/'),
  subscribe: (data) => api.post('/payments/subscribe/', data),
  history: () => api.get('/payments/history/'),
}

export const contactAPI = {
  submit: (data) => api.post('/contact/submit/', data),
}
