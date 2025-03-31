'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EventCard = ({ event }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/event/${event.eventId}`); // Redirect to the event details page
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative bg-cover bg-center rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer group overflow-hidden"
      style={{
        height: '300px',
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{
          backgroundImage: `url(${event.eventImageUrl})`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg transition duration-300"></div>

      {/* Event Name */}
      <div className="absolute bottom-4 left-4 z-10">
        <h3 className="text-2xl font-bold text-white transition duration-300">
          {event.eventName}
        </h3>
      </div>

      {/* Description */}
      <Link
        href={`/event/${event.eventId}`}
        className="absolute bottom-4 right-4 z-10 hidden group-hover:block bg-[#1F7D53] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition duration-300"
      >
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
