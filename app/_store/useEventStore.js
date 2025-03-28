import { create } from 'zustand';
import ApiService from '@/app/_lib/services/ApiService';

const useEventStore = create((set, get) => ({
  events: [],
  eventTypes: [],
  locations: [],
  selectedEvent: null,
  selectedEventType: null,
  selectedLocation: null,
  selectedEventId: null,
  selectedLocationId: null,
  selectedEventTypeId: null,
  selectedEventTypeName: null,
  venueId: null,
  sectionId: null,

  // Set events
  setEvents: (events) => set({ events }),

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
      console.log('Events refreshed:', events);
    } catch (error) {
      console.error('Failed to fetch events:', error.message);
    }
  },

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
