import { create } from 'zustand';
import ApiService from '@/app/_lib/services/ApiService';

const useEventStore = create((set, get) => ({
  events: [],
  eventTypes: [],
  locations: [],
  venues: [],
  sections: [],
  selectedEvent: null,
  selectedEventType: null,
  selectedLocation: null,
  selectedEventId: null,
  selectedLocationId: null,
  selectedEventTypeId: null,
  selectedEventTypeName: null,
  venueId: null,
  sectionId: null,
  selectedVenueId: null,
  selectedSectionId: null, // Add selectedSectionId to the store

  // Set venues
  setVenues: (venues) => set({ venues }),

  // Set selected venue ID
  setSelectedVenueId: (venueId) => set({ selectedVenueId: venueId }),

  // Fetch and refresh venues by selected location
  fetchAndRefreshVenues: async () => {
    try {
      const selectedLocationId = get().selectedLocationId; // Access the current selectedLocationId
      if (!selectedLocationId) {
        console.error('No location selected');
        return;
      }

      const venues = await ApiService.fetchVenuesByLocation(selectedLocationId);
      set({ venues });
    } catch (error) {
      console.error('Failed to fetch venues:', error.message);
    }
  },

  // Set sections
  setSections: (sections) => set({ sections }),

  // Fetch sections by venue
  fetchSectionsByVenue: async (venueId) => {
    try {
      const sections = await ApiService.fetchSectionsByVenue(venueId);
      set({ sections });
    } catch (error) {
      console.error('Failed to fetch sections:', error.message);
    }
  },

  // Set selected section ID
  setSelectedSectionId: (sectionId) => set({ selectedSectionId: sectionId }),

  // Set events
  setEvents: (events) => set({ events }),

  // Fetch all events and store them
  fetchAllEvents: async () => {
    try {
      const response = await ApiService.fetchEvents();
      const { content } = response; // Extract the content array
      set({ events: content }); // Store only the \
    } catch (error) {
      console.error('Failed to fetch events:', error.message);
    }
  },

  //fetch events by selected event type
  fetchEventsByType: async (eventType) => {
    try {
      const events = await ApiService.fetchEventsByType(eventType);
      set({ events });
    } catch (error) {
      console.error('Failed to fetch events:', error.message);
    }
  },

  // Fetch and refresh events by selected event type
  fetchAndRefreshEvents: async () => {
    try {
      const selectedEventType = get().selectedEventType; // Access the current selectedEventType
      if (!selectedEventType) {
        console.error('No event type selected');
        return;
      }

      const events = await ApiService.fetchEventsByType(selectedEventType);
      set({ events });
    } catch (error) {
      console.error('Failed to fetch events:', error.message);
    }
  },

  // fetch and refresh available events

  // Set event types
  setEventTypes: (eventTypes) => set({ eventTypes }),

  // Set locations
  setLocations: (locations) => set({ locations }),

  // Set selected event
  setSelectedEvent: (event) => set({ selectedEvent: event }),

  // Set selected event type
  setSelectedEventType: (eventType) => set({ selectedEventType: eventType }),

  // Set selected location
  setSelectedLocation: (location) => set({ selectedLocation: location }),

  // Set selected event id
  setSelectedEventId: (eventId) => set({ selectedEventId: eventId }),

  // Set selected location id
  setSelectedLocationId: (locationId) =>
    set({ selectedLocationId: locationId }),

  // Set selected event type id
  setSelectedEventTypeId: (eventTypeId) =>
    set({ selectedEventTypeId: eventTypeId }),

  // Set selected event type name
  setSelectedEventTypeName: (eventTypeName) =>
    set({ selectedEventTypeName: eventTypeName }),
}));

export default useEventStore;
