'use client';
import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      <div
        className="relative h-[50vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/contact-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Contact Us</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#255F38] mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-[#443627] leading-relaxed mb-6">
            Have questions or need assistance? We're here to help! Reach out to
            us using the contact information below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-[#255F38] text-3xl" />
              <span className="text-lg text-[#443627]">
                support@booking.com
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaPhone className="text-[#255F38] text-3xl" />
              <span className="text-lg text-[#443627]">+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-[#255F38] text-3xl" />
              <span className="text-lg text-[#443627]">
                123 Green Street, Event City, USA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
