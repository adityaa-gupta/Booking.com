'use client';
import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/contact-us.jpg')" }}
      >
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
          <motion.h1
            className="text-6xl font-extrabold text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contact Us
          </motion.h1>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-[#255F38] mb-6 text-center">
            Get in Touch
          </h2>
          <p className="text-lg text-[#443627] leading-relaxed text-center mb-8">
            Have questions or need assistance? We're here to help! Reach out to
            us using the contact information below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="flex flex-col items-center text-center bg-[#FAF1E6] p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <FaEnvelope className="text-[#255F38] text-5xl mb-4" />
              <h3 className="text-2xl font-bold text-[#255F38] mb-2">
                Email Us
              </h3>
              <p className="text-lg text-[#443627]">support@booking.com</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center text-center bg-[#FAF1E6] p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <FaPhone className="text-[#255F38] text-5xl mb-4" />
              <h3 className="text-2xl font-bold text-[#255F38] mb-2">
                Call Us
              </h3>
              <p className="text-lg text-[#443627]">+1 234 567 890</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center text-center bg-[#FAF1E6] p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <FaMapMarkerAlt className="text-[#255F38] text-5xl mb-4" />
              <h3 className="text-2xl font-bold text-[#255F38] mb-2">
                Visit Us
              </h3>
              <p className="text-lg text-[#443627]">
                123 Green Street, Event City, USA
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#FAF1E6] py-16">
        <div className="max-w-7xl mx-auto text-center text-[#27391C] px-8">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            We're Here to Help!
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Reach out to us anytime, and we'll do our best to assist you with
            your event planning needs.
          </motion.p>
          <motion.button
            className="bg-[#99BC85] text-[#255F38] px-8 py-4 rounded-full font-semibold hover:bg-[#E4EFE7] transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
