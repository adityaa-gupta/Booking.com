'use client';
import React, { useEffect } from 'react';
import useEventStore from '@/app/_store/useEventStore';
import EventCard from './EventCard';

const Events = () => {
  const { events, fetchAllEvents } = useEventStore();

  useEffect(() => {
    fetchAllEvents(); // Fetch all events when the component mounts
  }, []);
  console.log(events);

  return (
    <div className="p-8 bg-[#FDFAF6] min-h-screen">
      <h1 className="text-3xl text-[#255F38] font-bold mb-6">All Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            onSelect={() => console.log('Selected Event ID:', event.eventId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
