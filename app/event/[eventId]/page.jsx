'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApiService from '@/app/_lib/services/ApiService';
import {
  FaStar,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaTicketAlt,
  FaTheaterMasks,
  FaRegStar,
  FaTimesCircle,
} from 'react-icons/fa';
import {
  MdAccessTime,
  MdDateRange,
  MdEventSeat,
  MdLocationCity,
  MdSchedule,
} from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/app/_store/useAuthStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Review Modal Component - Fixed implementation
  const ReviewModal = () => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
      if (showReviewModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }

      // Cleanup function
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [showReviewModal]);

    if (!showReviewModal) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          setShowReviewModal(false);
        }}
      >
        {/* Semi-transparent backdrop */}
        <div className="fixed inset-0 bg-black opacity-60 backdrop-blur-sm"></div>

        {/* Modal content */}
        <div
          className="relative z-50 bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#255F38]">Write a Review</h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowReviewModal(false);
              }}
              className="text-gray-500 hover:text-[#255F38] transition-colors"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-[#443627] mb-2">Rate your experience:</p>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRating(star);
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  {star <= (hoverRating || rating) ? (
                    <FaStar className="text-[#255F38] text-2xl" />
                  ) : (
                    <FaRegStar className="text-[#255F38] text-2xl" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
              {rating === 0 && 'Select a rating'}
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="review" className="block text-[#443627] mb-2">
              Your Review:
            </label>
            <textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Share your experience with this event..."
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#255F38]/50 focus:border-[#255F38]"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSubmitReview();
            }}
            disabled={submitLoading || rating === 0 || !reviewText.trim()}
            className={`w-full py-3 rounded-lg font-medium text-white ${
              submitLoading || rating === 0 || !reviewText.trim()
                ? 'bg-gray-400'
                : 'bg-gradient-to-r from-[#255F38] to-[#1D4D34]'
            }`}
          >
            {submitLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </div>
    );
  };

  // Function to handle review submission
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      const redirectUrl = encodeURIComponent(`/event/${eventId}`);
      router.push(`/auth?redirect=${redirectUrl}`);
      return;
    }

    if (rating === 0) {
      toast.warning('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.warning('Please write a review');
      return;
    }

    try {
      setSubmitLoading(true);
      const reviewData = {
        eventId: parseInt(eventId),
        score: rating,
        review: reviewText,
      };

      const response = await ApiService.postReview(reviewData);

      // Add the new review to the reviews list with user data from auth store
      const newReview = {
        id: response?.id || Date.now(),
        username: user?.firstName || 'You',
        score: rating,
        review: reviewText,
        imageUrl:
          user?.imageUrl ||
          'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
      };

      setReviews([newReview, ...reviews]);

      // Reset form
      setRating(0);
      setReviewText('');
      setShowReviewModal(false);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Error submitting review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Function to load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Function to handle seat selection
  const handleSeatSelect = (seat) => {
    if (!seat.isAvailable) return;

    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Function to handle checkout and payment
  const handleCheckout = async (sessionId, selectedSeats) => {
    if (!isAuthenticated) {
      const redirectUrl = encodeURIComponent(`/event/${eventId}`);
      router.push(`/auth?redirect=${redirectUrl}`);
      return;
    }

    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat to proceed.');
      return;
    }

    try {
      setPaymentProcessing(true);
      const bookSeats = selectedSeats.map((seat) => seat.id);
      const bookingData = {
        sessionId,
        bookSeats,
      };

      // Create booking
      const bookingResponse = await ApiService.createBooking(bookingData);
      console.log('Booking created:', bookingResponse);

      if (!bookingResponse) {
        toast.error('Failed to create booking. Please try again.');
        setPaymentProcessing(false);
        return;
      }

      const { bookingId, totalAmount } = bookingResponse;

      // Get payment order from server
      const paymentData = {
        bookingId,
        totalAmountToPay: totalAmount,
      };

      const paymentResponse = await ApiService.makePayment(paymentData);
      console.log('Payment order created:', paymentResponse);

      // Load Razorpay script if not already loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setPaymentProcessing(false);
        return;
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100, // Amount in paisa
        currency: 'INR',
        name: ' Booking',
        description: `Booking for ${event.eventName}`,
        order_id: paymentResponse.razorpay_order_id,
        handler: async function (response) {
          console.log('Payment successful:', response, paymentResponse);

          // Verify payment on your server
          try {
            const razorpay_order_id = paymentResponse.razorpay_order_id;
            const razorpay_payment_id = response.razorpay_payment_id;
            console.log(response);
            const verificationResponse = await ApiService.verifyPayment(
              razorpay_order_id,
              razorpay_payment_id
            );

            toast.success('Payment successful! Your booking is confirmed.');
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Error verifying payment. Please contact support.');
          }

          // Clear selected seats
          setSelectedSeats([]);
          setSelectedSession(null);
          setSeats([]);
          setPaymentProcessing(false);
        },
        prefill: {
          name: user?.firstName + ' ' + user?.lastName || 'Customer Name',
          email: user?.email || 'customer@example.com',
          contact: user?.phone || '9999999999',
        },
        theme: {
          color: '#255F38',
        },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled');
            setPaymentProcessing(false);
          },
        },
      };

      // Open Razorpay payment form
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error processing payment:', error.message);
      toast.error('Error processing payment. Please try again.');
      setPaymentProcessing(false);
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
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

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
            <FaStar className="text-[#f6c41d]" />
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
                            className="px-2 py-1 bg-white text-green-950 rounded-md text-sm"
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
                        onClick={() => {
                          handleCheckout(selectedSession, selectedSeats);
                        }}
                        disabled={
                          selectedSeats.length === 0 || paymentProcessing
                        }
                        className={`w-full mt-4 ${
                          paymentProcessing
                            ? 'bg-gray-400'
                            : 'bg-gradient-to-r from-[#255F38] to-[#1D4D34]'
                        } text-white py-2 rounded-md font-medium shadow-md flex items-center justify-center`}
                      >
                        {paymentProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          'Proceed to Payment'
                        )}
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
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    const redirectUrl = encodeURIComponent(`/event/${eventId}`);
                    router.push(`/auth?redirect=${redirectUrl}`);
                  } else {
                    setShowReviewModal(true);
                  }
                }}
                className="px-6 py-2 bg-[#255F38] text-white rounded-full font-medium hover:bg-[#1D4D34] transition-colors"
              >
                Write a Review
              </button>
            </motion.div>
          )}
          {/* Add a "Write a Review" button if reviews exist
          {reviews && reviews.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    const redirectUrl = encodeURIComponent(`/event/${eventId}`);
                    router.push(`/auth?redirect=${redirectUrl}`);
                  } else {
                    setShowReviewModal(true);
                  }
                }}
                className="px-6 py-2 bg-[#255F38] text-white rounded-full font-medium hover:bg-[#1D4D34] transition-colors"
              >
                Write Your Review
              </button>
            </div>
          )} */}
        </motion.div>
      </div>

      {/* Review Modal */}
      <ReviewModal />
    </div>
  );
};

export default EventDetailsPage;
