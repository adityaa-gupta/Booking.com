const ENDPOINTS = {
  EVENTS: {
    GET: '/unifiedbookingsystem/v1/events/event-types',
    GET_ALL: '/unifiedbookingsystem/v1/events/event-types',
    POST: '/unifiedbookingsystem/v1/events',
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
    GET: '/unifiedbookingsystem/v1/events/sessions/{sessionId}/available-seats',
    UPLOAD_SEAT: '/unifiedbookingsystem/v1/seats/temp/sections/{sectionId}',
    VERIFY_SEAT: '/unifiedbookingsystem/v1/seats/verify',
    FINAL_UPLOAD: '/unifiedbookingsystem/v1/seats',
  },
  USER: {
    GET: 'unifiedbookingsystem/v1/users/{userId}',
    POST: '/unifiedbookingsystem/v1/users',
    LOGIN: '/unifiedbookingsystem/v1/users/login',
    SIGNUP: '/unifiedbookingsystem/v1/users',
  },
};

export default ENDPOINTS;
