'use client';
import useAuthStore from '@/app/_store/useAuthStore';
import axios from 'axios';
import ENDPOINTS from '../constants/constans';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true,
  // timeout: 10000, // 10 seconds
});

// **Attach an interceptor to dynamically add the latest token**
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken; //
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleApiError = (error) => {
  console.error('API Error:', error);
  const errorMessage = error.response?.data?.message || 'Something went wrong!';
  throw new Error(errorMessage);
};

const ApiService = {
  //user login
  login: async (userData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.USER.LOGIN, userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  //user registration
  register: async (userData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.USER.POST, userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch event types
  fetchEventTypes: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.EVENTS.GET);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch all events
  fetchEvents: async (eventName) => {
    const params = eventName ? { eventName } : {};
    try {
      const response = await apiClient.get(ENDPOINTS.EVENTS.GET_ALL, {
        params,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch events by type
  fetchEventsByType: async (eventId) => {
    const apiUrl = ENDPOINTS.EVENT_TYPE.GET.replace('{typeId}', eventId);
    try {
      const response = await apiClient.get(apiUrl);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Add a new event
  addEvent: async (eventData) => {
    try {
      const response = await apiClient.post(
        ENDPOINTS.EVENT_TYPE.POST,
        eventData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch locations
  fetchLocations: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.LOCATIONS.GET);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Create a session
  createSession: async (sessionData) => {
    try {
      const response = await apiClient.post(
        ENDPOINTS.SESSION.POST,
        sessionData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch venues by location
  fetchVenuesByLocation: async (locationId) => {
    const apiUrl = ENDPOINTS.VENUE.GET.replace('{locationId}', locationId);
    try {
      const response = await apiClient.get(apiUrl);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Add a new venue
  addVenue: async (venueData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.VENUE.POST, venueData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch sections by venue
  fetchSectionsByVenue: async (venueId) => {
    const apiUrl = ENDPOINTS.SECTION.GET.replace('{venueId}', venueId);
    try {
      const response = await apiClient.get(apiUrl);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Add a new section
  addSection: async (sectionData) => {
    try {
      const response = await apiClient.post(
        ENDPOINTS.SECTION.POST,
        sectionData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  //fetch section seats

  fetchSectionSeats: async (sectionId) => {
    const apiUrl = ENDPOINTS.SEAT.GET.replace('{sectionId}', sectionId);
    try {
      const response = await apiClient.get(apiUrl);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Upload seats for a section
  uploadSeats: async (sectionId, seatData) => {
    const apiUrl = ENDPOINTS.SEAT.UPLOAD_SEAT.replace('{sectionId}', sectionId);
    try {
      const response = await apiClient.post(apiUrl, seatData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Verify seats
  verifySeats: async (uploadId) => {
    try {
      const response = await apiClient.post(ENDPOINTS.SEAT.VERIFY_SEAT, null, {
        // No request body, so pass `null`
        params: {
          uploadId: uploadId, // Send as a query parameter
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Finalize seat upload
  finalizeSeatUpload: async (uploadId) => {
    try {
      const response = await apiClient.post(ENDPOINTS.SEAT.FINAL_UPLOAD, null, {
        params: {
          uploadId: uploadId,
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getUserDetails: async (userId) => {
    try {
      const response = await apiClient.get(
        ENDPOINTS.USER.GET.replace('{userId}', userId)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  //fetch event sessions
  fetchEventSessions: async (eventId) => {
    try {
      const response = await apiClient.get(
        ENDPOINTS.SESSION.GET.replace('{eventId}', eventId)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // get seats
  getSeats: async (sectionId) => {
    try {
      const response = await apiClient.get(
        ENDPOINTS.SEAT.GET_AVL_SEAT.replace('{sessionId}', sectionId)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch event by ID
  fetchEventById: async (eventId) => {
    try {
      const response = await apiClient.get(
        ENDPOINTS.EVENTS.GET_BY_ID.replace('{eventId}', eventId)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Fetch reviews by event ID
  fetchReviewsByEventId: async (eventId) => {
    try {
      const response = await apiClient.get(
        ENDPOINTS.REVIEW.GET.replace('{eventId}', eventId)
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // User profile methods
  getUserProfile: async ({ userId }) => {
    try {
      const response = await apiClient.get(
        ENDPOINTS.USER.GET.replace('{userId}', userId)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      handleApiError(error);
    }
  },

  updateUserProfile: async (userData) => {
    try {
      // Make sure the API request includes the profilePhoto URL
      const response = await apiClient.put(
        ENDPOINTS.USER.UPDATE.replace('{userId}', userData.userId),
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          dateOfBirth: userData.dateOfBirth,
          profilePhoto: userData.profilePhoto, // Include the profilePhoto URL
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      handleApiError(error);
    }
  },

  //create booking

  createBooking: async (bookingData) => {

    try {
      const response = await apiClient.post(
        ENDPOINTS.SEAT.BOOK_SEAT,
        bookingData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Payment methods
  makePayment: async (paymentData) => {
    try {
      const response = await apiClient.post(
        ENDPOINTS.SEAT.PAYMENT,
        paymentData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  verifyPayment: async (razorpay_order_id, razorpay_payment_id) => {
  
    try {
      const response = await apiClient.post(
        ENDPOINTS.SEAT.PAYMENT_VERIFY,
        null,
        {
          params: {
            razorpay_order_id,
            razorpay_payment_id,
          },
        }
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Booking methods
  getUserBookings: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.SEAT.USER_SEAT);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // post review

  postReview: async (reviewData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.REVIEW.POST, reviewData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  cancelBooking: async (bookingId) => {
    try {
      const response = await apiClient.put(
        `/api/bookings/${bookingId}/cancel`,
        {}
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  //forgot password
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post(ENDPOINTS.USER.FORGOT_PASSWORD, {
        email,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  //reset password
  resetPassword: async (passwordData) => {
    try {
      const response = await apiClient.post(
        ENDPOINTS.USER.RESET_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  // Google OAuth
  googleOAuth: async (token) => {
    const params = { token };
    try {
      const response = await apiClient.post(ENDPOINTS.USER.O_AUTH, null, {
        params,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default ApiService;
