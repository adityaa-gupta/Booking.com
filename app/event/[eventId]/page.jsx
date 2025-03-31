'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ApiService from '@/app/_lib/services/ApiService';
import { FaStar } from 'react-icons/fa';

const EventDetailsPage = () => {
  const { eventId } = useParams(); // Get eventId from the URL params
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await ApiService.fetchEventById(eventId); // Fetch event details using the eventId
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error.message);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFAF6]">
        <p className="text-[#255F38] font-semibold text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <img
          src={event.eventImageUrl}
          alt={event.eventName}
          className="absolute inset-0 w-full h-full  "
        />
        <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">
            {event.eventName}
          </h1>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Event Description */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#255F38] mb-4">
              About the Event
            </h2>
            <p className="text-lg text-[#443627] leading-relaxed">
              {event.eventDescription}
            </p>
          </div>

          {/* Event Info */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-[#255F38] mb-4">
              Event Details
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#255F38]">Event ID:</span>
                <span className="text-[#443627]">{event.eventId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#255F38]">
                  Average Rating:
                </span>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span className="text-[#443627]">
                    {event.averageRating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
