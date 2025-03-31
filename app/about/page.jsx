'use client';
import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      <div
        className="relative h-[50vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">About Us</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#255F38] mb-6">Who We Are</h2>
          <p className="text-lg text-[#443627] leading-relaxed">
            Welcome to Booking.com, your one-stop solution for booking events,
            venues, and more. Our mission is to make event planning seamless and
            hassle-free. Whether you're organizing a corporate event, a wedding,
            or a concert, we provide the tools and resources you need to make it
            a success.
          </p>
          <p className="text-lg text-[#443627] leading-relaxed mt-4">
            With a wide range of venues, services, and features, we aim to be
            the most reliable platform for all your event needs. Thank you for
            choosing Booking.com!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
