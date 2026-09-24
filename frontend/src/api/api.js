import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:5000/api';
  }
  return 'https://digital-yatra-1.onrender.com/api';
};

const API_BASE_URL = getBaseUrl();
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication APIs
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await api.post('/auth/reset-password', payload);
  return response.data;
};

export const loginWithGoogle = async (payload) => {
  const response = await api.post('/auth/google', payload);
  return response.data;
};

export const updateUserProfile = async (payload) => {
  const response = await api.post('/auth/profile/update', payload);
  return response.data;
};


// Destination APIs (India-wide)
export const getDestinations = async (params = {}) => {
  const response = await api.get('/destinations', { params });
  return response.data;
};

export const getDestinationDetail = async (id) => {
  const response = await api.get(`/destinations/${id}`);
  return response.data;
};
export const getDestinationById = getDestinationDetail;

// Trip & Itinerary APIs
export const createTrip = async (tripData) => {
  const response = await api.post('/trips/create', tripData);
  return response.data;
};

export const getTrip = async (tripId) => {
  const response = await api.get(`/trips/${tripId}`);
  return response.data;
};

export const getRecommendations = async (params) => {
  const response = await api.post('/recommendations', params);
  return response.data;
};

export const generateItinerary = async (params) => {
  const response = await api.post('/itinerary/generate', params);
  return response.data;
};

export const estimateBudget = async (params) => {
  const response = await api.post('/budget/estimate', params);
  return response.data;
};

// Guide Me & Map Services APIs
export const getNearbyServices = async (params = {}) => {
  const response = await api.get('/guide/nearby', { params });
  return response.data;
};

export const getMapMarkers = async (params = {}) => {
  const response = await api.get('/guide/markers', { params });
  return response.data;
};

// Local Guide Booking & Profile APIs
export const getGuideList = async (city = '') => {
  const params = typeof city === 'string' ? (city ? { city } : {}) : city;
  const response = await api.get('/guides', { params });
  return response.data;
};
export const getLocalGuides = getGuideList;

export const getGuideDetail = async (id) => {
  const response = await api.get(`/guides/${id}`);
  return response.data;
};

export const bookGuide = async (payload) => {
  const response = await api.post('/guides/book', payload);
  return response.data;
};
export const createGuideBooking = bookGuide;

export const cancelGuideBooking = async (bookingId) => {
  const response = await api.put(`/guides/booking/${bookingId}/cancel`);
  return response.data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.put(`/guides/booking/${bookingId}/status`, { status });
  return response.data;
};

export const getTouristBookings = async (params = {}) => {
  const response = await api.get('/guides/my-bookings', { params });
  return response.data;
};

export const getGuideDashboard = async (params = {}) => {
  const response = await api.get('/guides/dashboard', { params });
  return response.data;
};

export const updateGuideAvailability = async (payload) => {
  const response = await api.put('/guides/availability', payload);
  return response.data;
};

export const updateGuideProfile = async (payload) => {
  const response = await api.put('/guides/profile', payload);
  return response.data;
};

// Report APIs
export const submitReportFormData = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/reports`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getUserReports = async (params = {}) => {
  const response = await api.get('/reports', { params });
  return response.data;
};

// Safety Mode APIs
export const getEmergencyInfo = async () => {
  const response = await api.get('/safety/emergency');
  return response.data;
};

export const triggerSOS = async (payload) => {
  const response = await api.post('/safety/sos', payload);
  return response.data;
};

export const shareLocation = async (payload) => {
  const response = await api.post('/safety/share-location', payload);
  return response.data;
};

// AI Assistant, Conversations & Attachment APIs
export const sendChatMessage = async (payload) => {
  const response = await api.post('/assistant/chat', payload);
  return response.data;
};

export const fetchUserConversations = async (userId = 1) => {
  const response = await api.get('/chat/conversations', { params: { user_id: userId } });
  return response.data;
};

export const createConversation = async (payload) => {
  const response = await api.post('/chat/conversations', payload);
  return response.data;
};

export const fetchConversationMessages = async (convId) => {
  const response = await api.get(`/chat/conversations/${convId}`);
  return response.data;
};

export const renameConversation = async (convId, title) => {
  const response = await api.put(`/chat/conversations/${convId}`, { title });
  return response.data;
};

export const deleteConversation = async (convId) => {
  const response = await api.delete(`/chat/conversations/${convId}`);
  return response.data;
};

export const uploadChatAttachment = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/chat/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const compareFare = async (payload) => {
  const response = await api.post('/fares/compare', payload);
  return response.data;
};

// Admin Dashboard & Verification APIs
export const getAdminDashboardMetrics = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAdminReports = async (params = {}) => {
  const response = await api.get('/admin/reports', { params });
  return response.data;
};

export const updateReportStatus = async (reportId, status) => {
  const response = await api.put(`/admin/reports/${reportId}`, { status });
  return response.data;
};

export const getAdminGuides = async () => {
  const response = await api.get('/admin/guides');
  return response.data;
};

export const verifyGuideByAdmin = async (guideId, verifiedOrStatus) => {
  const payload = typeof verifiedOrStatus === 'boolean'
    ? { verified: verifiedOrStatus, status: verifiedOrStatus ? 'VERIFIED' : 'REJECTED' }
    : { status: verifiedOrStatus };
  const response = await api.put(`/admin/guides/${guideId}/verify`, payload);
  return response.data;
};
export const verifyGuide = verifyGuideByAdmin;

export const revokeGuideByAdmin = async (guideId) => {
  const response = await api.put(`/admin/guides/${guideId}/revoke`);
  return response.data;
};

export const submitUserFeedback = async (payload) => {
  const response = await api.post('/feedback', payload);
  return response.data;
};

export default api;
