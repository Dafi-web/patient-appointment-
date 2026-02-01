import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Update token when it changes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't set Content-Type for FormData - let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Patients
export const getPatients = () => api.get('/patients');
export const getPatientById = (id) => api.get(`/patients/${id}`);
export const createPatient = (data) => api.post('/patients', data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// Doctors
export const getDoctors = () => api.get('/doctors');
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
export const createDoctor = (data) => api.post('/doctors', data);
export const updateDoctor = (id, data) => api.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);

// Appointments
export const getAppointments = () => api.get('/appointments');
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
export const getAppointmentsByPatient = (patientId) => api.get(`/appointments/patient/${patientId}`);
export const getAppointmentsByDoctor = (doctorId) => api.get(`/appointments/doctor/${doctorId}`);
export const getAvailableSlots = (doctorId, date) => api.post('/appointments/available-slots', { doctorId, date });
export const getAvailableDates = (doctorId) => api.get(`/appointments/available-dates/${doctorId}`);
export const approveAppointment = (id, adminNotes) => api.put(`/appointments/${id}/approve`, { adminNotes });
export const rejectAppointment = (id, adminNotes) => api.put(`/appointments/${id}/reject`, { adminNotes });
export const getPendingAppointments = () => api.get('/appointments/pending');

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (userData) => api.put('/auth/profile', userData);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export default api;
