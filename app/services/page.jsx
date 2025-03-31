'use client';
import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair } from 'react-icons/fa';

const ServicesPage = () => {
  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[50vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/services-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Our Services</h1>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <FaCalendarAlt className="text-[#255F38] text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-[#255F38] mb-2">
              Event Booking
            </h2>
            <p className="text-lg text-[#443627]">
              Book events with ease using our user-friendly platform.
            </p>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <FaMapMarkerAlt className="text-[#255F38] text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-[#255F38] mb-2">
              Venue Selection
            </h2>
            <p className="text-lg text-[#443627]">
              Choose from a wide range of venues for your events.
            </p>
          </div>

          {/* Service Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <FaChair className="text-[#255F38] text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-[#255F38] mb-2">
              Seating Arrangements
            </h2>
            <p className="text-lg text-[#443627]">
              Customize seating arrangements to suit your event needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
