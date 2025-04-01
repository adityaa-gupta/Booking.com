'use client';
import React from 'react';
import {
  FaCheckCircle,
  FaGlobe,
  FaUsers,
  FaHandshake,
  FaLightbulb,
  FaRocket,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutPage = () => {
  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[60vh] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/about-us.jpg')" }}
      >
        <div className="absolute inset-0  bg-opacity-50 flex items-center justify-center">
          <motion.h1
            className="text-6xl font-extrabold text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Us
          </motion.h1>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          className="p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-[#255F38] mb-6 text-center">
            Who We Are
          </h2>
          <p className="text-lg text-[#443627] leading-relaxed text-center mb-8">
            Welcome to Booking.com, your one-stop solution for booking events,
            venues, and more. Our mission is to make event planning seamless and
            hassle-free. Whether you're organizing a corporate event, a wedding,
            or a concert, we provide the tools and resources you need to make it
            a success.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaGlobe className="text-[#27391C] text-3xl" />
              <p className="text-lg text-[#443627]">
                Wide range of venues to suit every occasion.
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaUsers className="text-[#27391C] text-3xl" />
              <p className="text-lg text-[#443627]">
                User-friendly platform for seamless bookings.
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaHandshake className="text-[#27391C] text-3xl" />
              <p className="text-lg text-[#443627]">
                Dedicated customer support for all your needs.
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaCheckCircle className="text-[#27391C] text-3xl" />
              <p className="text-lg text-[#443627]">
                Trusted by thousands of event organizers worldwide.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Vision and Mission Section */}
      <div className="bg-[#FAF1E6] p-16">
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaLightbulb className="text-[#255F38] text-5xl mb-4" />
              <h3 className="text-3xl font-bold text-[#255F38] mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-[#945034] leading-relaxed">
                To revolutionize the event planning industry by providing a
                platform that simplifies the process and ensures memorable
                experiences for everyone.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <FaRocket className="text-[#255F38] text-5xl mb-4" />
              <h3 className="text-3xl font-bold text-[#255F38] mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-[#945034] leading-relaxed">
                To empower individuals and organizations with the tools and
                resources they need to create successful events, while fostering
                a community of trust and excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#FAF1E6] p-16">
        <div className="max-w-7xl mx-auto text-center text-[#27391C] p-8">
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Plan Your Next Event?
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of satisfied customers who trust Booking.com for
            their event planning needs.
          </motion.p>
          <motion.button
            className="bg-[#99BC85] text-[#255F38] px-8 py-4 rounded-full font-semibold hover:bg-[#99BC85] transition duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
