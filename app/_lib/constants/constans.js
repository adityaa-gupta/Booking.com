const ENDPOINTS = {
  EVENTS: {
    GET: '/unifiedbookingsystem/v1/events/event-types',
    GET_ALL: '/unifiedbookingsystem/v1/events',
    POST: '/unifiedbookingsystem/v1/events',
    GET_BY_ID: '/unifiedbookingsystem/v1/events/{eventId}',
  },
  EVENT_TYPE: {
    GET: '/unifiedbookingsystem/v1/events/event-types/{typeId}',
    POST: '/unifiedbookingsystem/v1/events',
  },
  LOCATIONS: {
    GET: '/unifiedbookingsystem/v1/locations',
    POST: '/unifiedbookingsystem/v1/locations',
  },

  SESSION: {
    GET: '/unifiedbookingsystem/v1/sessions/events/{eventId}',
    POST: '/unifiedbookingsystem/v1/sessions',
  },
  VENUE: {
    GET: '/unifiedbookingsystem/v1/venues/locations/{locationId}',
    POST: '/unifiedbookingsystem/v1/venues',
  },
  SECTION: {
    GET: '/unifiedbookingsystem/v1/sections/venues/{venueId}',
    POST: '/unifiedbookingsystem/v1/sections',
  },
  SEAT: {
    GET: '/unifiedbookingsystem/v1/seats/sections/{sectionId}',
    GET_AVL_SEAT:
      '/unifiedbookingsystem/v1/sessions/{sessionId}/available-seats',
    UPLOAD_SEAT: '/unifiedbookingsystem/v1/seats/temp/sections/{sectionId}',
    VERIFY_SEAT: '/unifiedbookingsystem/v1/seats/verify',
    FINAL_UPLOAD: '/unifiedbookingsystem/v1/seats',
    BOOK_SEAT: '/unifiedbookingsystem/v1/book/seats',
    PAYMENT: '/unifiedbookingsystem/v1/make-payment',
    PAYMENT_VERIFY: '/unifiedbookingsystem/v1/handle-payment-callback',
    USER_SEAT: '/unifiedbookingsystem/v1/booking-details/users',
  },
  USER: {
    GET: 'unifiedbookingsystem/v1/users/{userId}',
    UPDATE: 'unifiedbookingsystem/v1/users/{userId}',
    POST: '/unifiedbookingsystem/v1/users',
    LOGIN: '/unifiedbookingsystem/v1/users/login',
    SIGNUP: '/unifiedbookingsystem/v1/users',
    FORGOT_PASSWORD: '/unifiedbookingsystem/v1/users/forgot-password',
    RESET_PASSWORD: '/unifiedbookingsystem/v1/users/reset-password',
    O_AUTH: '/unifiedbookingsystem/v1/oauth',
  },
  REVIEW: {
    GET: '/unifiedbookingsystem/v1/ratings/{eventId}',
    POST: '/unifiedbookingsystem/v1/ratings',
  },
};

export default ENDPOINTS;
