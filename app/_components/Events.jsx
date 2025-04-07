'use client';
import React, { useEffect, useRef } from 'react';
import useEventStore from '@/app/_store/useEventStore';
import EventCard from './EventCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Inner component that uses useSearchParams
function EventsList() {
  const { events, fetchAllEvents, fetchEventsByType } = useEventStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const eventsRef = useRef(null);

  // Map of event type IDs to their display names
  const eventTypeNames = {
    3: 'Concerts',
    2: 'Movies',
    1: 'Events',
  };

  useEffect(() => {
    if (type) {
      fetchEventsByType(type); // Fetch events based on the type from URL

      // Scroll to events section with smooth behavior
      setTimeout(() => {
        eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      fetchAllEvents(); // Fetch all events when the component mounts
    }
  }, [type, fetchEventsByType, fetchAllEvents]);

  const clearFilter = () => {
    router.push('/'); // Remove the type query parameter
  };

  return (
    <div
      ref={eventsRef}
      className="p-8 bg-[#FDFAF6] min-h-screen transition-all duration-500"
    >
      <div className="flex items-center mb-6">
        <h1 className="text-3xl text-[#255F38] font-bold">
          {type ? `${eventTypeNames[type] || 'Selected'} Events` : 'All Events'}
        </h1>
        {type && (
          <button
            onClick={clearFilter}
            className="ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-[#99BC85] text-white hover:bg-[#88A372] transition-all duration-300"
            aria-label="Clear filter"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            onSelect={() => console.log('Selected Event ID:', event.eventId)}
            className="animate-fadeIn"
          />
        ))}
        {events?.length === 0 && (
          <div className="col-span-3 text-center py-10 text-gray-500">
            No events found for this category.
          </div>
        )}
      </div>
    </div>
  );
}

// Main component that wraps the EventsList with Suspense
const Events = () => {
  return (
    <Suspense
      fallback={
        <div className="p-8 bg-[#FDFAF6] min-h-screen">Loading events...</div>
      }
    >
      <EventsList />
    </Suspense>
  );
};

export default Events;
