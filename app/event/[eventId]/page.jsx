'use client';
import React, { use, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ApiService from '@/app/_lib/services/ApiService';
import {
  FaStar,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaTicketAlt,
  FaTheaterMasks,
} from 'react-icons/fa';
import {
  MdAccessTime,
  MdDateRange,
  MdEventSeat,
  MdLocationCity,
  MdSchedule,
} from 'react-icons/md';
import { motion } from 'framer-motion';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Function to handle seat selection
  const handleSeatSelect = (seat) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Group seats by row
  const groupedSeats = seats.seat
    ? seats.seat.reduce((acc, seat) => {
        const row = seat.number.charAt(0);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
      }, {})
    : {};

  // Calculate total for selected seats
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  useEffect(() => {
    const fetchEventSessions = async () => {
      try {
        const data = await ApiService.fetchEventSessions(eventId);
        setSessions(data);
      } catch (error) {
        console.error('Error fetching event sessions:', error.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await ApiService.fetchReviewsByEventId(eventId);

        setReviews(data);
      } catch (error) {
        console.error('Error fetching event reviews:', error.message);
      }
    };
    fetchReviews();
    fetchEventSessions();
  }, [eventId]);

  useEffect(() => {
    const fetchEventSeats = async () => {
      try {
        const data = await ApiService.getSeats(selectedSession);

        setSeats(data);
      } catch (error) {
        console.error('Error fetching event seats:', error.message);
      }
    };
    if (selectedSession) fetchEventSeats();
  }, [selectedSession]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await ApiService.fetchEventById(eventId);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#f0f9eb] to-[#FDFAF6]">
        <div className="p-8 rounded-full bg-white shadow-md">
          <div className="w-16 h-16 border-4 border-[#255F38] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f0f9eb] to-[#FDFAF6]">
      {/* Hero Section */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <img
          src={event.eventImageUrl}
          alt={event.eventName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#255F38]/70 to-black/50 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold text-white text-center drop-shadow-lg mb-4"
          >
            {event.eventName}
          </motion.h1>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full"
          >
            <FaStar className="text-[#255F38]" />
            <span className="text-white font-medium">
              {event.averageRating?.toFixed(1) || 'New'} Rating
            </span>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-[#255F38] mb-6 flex items-center gap-3">
          <FaInfoCircle className="text-[#255F38]" />
          About the Event
        </h2>
        <p className="text-lg text-[#443627] leading-relaxed mb-12">
          {event.eventDescription}
        </p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Event Description */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-white p-8 rounded-xl shadow-lg"
          >
            {selectedSession && seats.seat ? (
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-[#255F38] mb-6">
                  Select Your Seats
                </h3>

                {/* Screen indicator */}
                <div className="w-4/5 h-8 bg-gradient-to-r from-[#255F38]/20 to-[#255F38]/20 mb-8 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#255F38]/10 transform skew-y-3"></div>
                  <p className="text-center text-[#255F38] font-medium relative z-10 mt-1">
                    SCREEN
                  </p>
                </div>

                {/* Seats container */}
                <div className="w-full mb-8">
                  {/* Render rows of seats */}
                  {Object.keys(groupedSeats).map((row) => (
                    <div key={row} className="flex justify-center mb-4">
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-[#255F38]">
                        {row}
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {groupedSeats[row].map((seat) => (
                          <motion.button
                            key={seat.id}
                            whileHover={seat.isAvailable ? { scale: 1.1 } : {}}
                            whileTap={seat.isAvailable ? { scale: 0.95 } : {}}
                            onClick={() => handleSeatSelect(seat)}
                            className={`w-10 h-10 rounded-md flex items-center justify-center font-medium text-sm transition-all ${
                              selectedSeats.find((s) => s.id === seat.id)
                                ? 'bg-[#255F38] text-white'
                                : seat.isAvailable
                                ? 'bg-[#e7f4df] text-[#255F38] hover:bg-[#d0e7c0]'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {seat.number.substring(1)}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#e7f4df] rounded-md"></div>
                    <span className="text-sm text-[#443627]">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#255F38] rounded-md"></div>
                    <span className="text-sm text-[#443627]">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
                    <span className="text-sm text-[#443627]">Unavailable</span>
                  </div>
                </div>

                {/* Selected seats info */}
                <div className="w-full mt-4 p-4 bg-[#f0f9eb] rounded-lg">
                  <h4 className="font-bold text-[#255F38] mb-2">
                    Selected Seats: {selectedSeats.length}
                  </h4>
                  {selectedSeats.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedSeats.map((seat) => (
                          <span
                            key={seat.id}
                            className="px-2 py-1 bg-white rounded-md text-sm"
                          >
                            {seat.number} (₹{seat.price})
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center border-t border-[#d0e7c0] pt-3 mt-3">
                        <span className="font-bold text-[#443627]">Total:</span>
                        <span className="font-bold text-[#255F38]">
                          ₹{totalPrice}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 bg-gradient-to-r from-[#255F38] to-[#1D4D34] text-white py-2 rounded-md font-medium shadow-md"
                      >
                        Proceed to Checkout
                      </motion.button>
                    </>
                  ) : (
                    <p className="text-[#443627]">
                      Please select seats to continue
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <h3 className="text-xl font-semibold text-[#255F38] mb-4">
                  Seat Selection
                </h3>
                <p className="text-[#443627] text-center">
                  Please select a show from the options on the right to view
                  available seats.
                </p>
                <MdEventSeat className="text-[#255F38] text-6xl mt-6 opacity-50" />
              </div>
            )}
          </motion.div>

          {/* Available Shows */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl font-bold text-[#255F38] mb-6 flex items-center gap-3">
              <FaTicketAlt className="text-[#255F38]" />
              Available Shows
            </h2>
            <div className="space-y-6">
              {sessions.length > 0 ? (
                sessions.map((session, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${
                      selectedSession === session.sessionId
                        ? 'border-[#1D4D34]'
                        : 'border-[#255F38]'
                    } hover:shadow-xl transition-all`}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-[#255F38] flex items-center gap-2">
                          <MdLocationCity className="text-[#255F38]" />
                          {session.locationName}
                        </h3>
                        <p className="text-[#443627] flex items-center gap-2 mt-2">
                          <span className="bg-[#f0f9eb] p-1 rounded-md">
                            <FaMapMarkerAlt className="text-[#255F38]" />
                          </span>
                          {session.address}
                        </p>
                        <p className="text-[#443627] flex items-center gap-2 mt-2">
                          <span className="bg-[#f0f9eb] p-1 rounded-md">
                            <MdEventSeat className="text-[#255F38]" />
                          </span>
                          {session.sectionName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="bg-gradient-to-br from-[#f0f9eb] to-[#e7f4df] p-4 rounded-lg shadow-inner">
                          <div className="mb-3 flex gap-2 pb-2 border-b border-[#d0e7c0]">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <MdDateRange className="text-[#255F38] text-xl" />
                            </div>
                            <p className="text-[#443627] font-medium text-right">
                              {new Date(session.startTime).toLocaleDateString(
                                'en-US',
                                {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <MdAccessTime className="text-[#255F38] text-xl" />
                            </div>
                            <p className="text-[#443627] font-medium text-right">
                              {new Date(session.startTime).toLocaleTimeString(
                                'en-US',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedSession(session.sessionId);
                        setSelectedSeats([]);
                      }}
                      className={`mt-4 w-full ${
                        selectedSession === session.sessionId
                          ? 'bg-[#1D4D34]'
                          : 'bg-gradient-to-r from-[#255F38] to-[#1D4D34]'
                      } text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                      <FaTheaterMasks className="text-white" />
                      {selectedSession === session.sessionId
                        ? 'Selected Show'
                        : 'Book Tickets Now'}
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#443627] bg-white p-4 rounded-lg shadow"
                >
                  No shows available at the moment.
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-[#255F38] mb-8 flex items-center gap-3">
            <FaStar className="text-[#255F38]" />
            What People Say
          </h2>

          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-3 hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Review header with avatar and username */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#e7f4df]">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#255F38]">
                      <img
                        src={review.imageUrl}
                        alt={review.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#255F38]">
                        {review.username}
                      </h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < review.score
                                ? 'text-[#255F38]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review content */}
                  <div className="flex-1 bg-[#f0f9eb]/50 p-4 rounded-lg">
                    <p className="text-[#443627] italic relative">
                      <span className="text-[#255F38] text-4xl font-serif absolute top-0 left-0 opacity-20">
                        "
                      </span>
                      <span className="pl-4">{review.review}</span>
                      <span className="text-[#255F38] text-4xl font-serif absolute bottom-0 right-2 opacity-20">
                        "
                      </span>
                    </p>
                  </div>

                  {/* Review date - for design purposes adding a placeholder */}
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-xl shadow text-center"
            >
              <img
                src="https://img.icons8.com/fluency/96/null/comments.png"
                alt="No reviews"
                className="w-24 h-24 mx-auto mb-4 opacity-60"
              />
              <h3 className="text-xl font-semibold text-[#255F38] mb-2">
                No Reviews Yet
              </h3>
              <p className="text-[#443627] mb-6">
                Be the first to share your experience!
              </p>
              <button className="px-6 py-2 bg-[#255F38] text-white rounded-full font-medium hover:bg-[#1D4D34] transition-colors">
                Write a Review
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
