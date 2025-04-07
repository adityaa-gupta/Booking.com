'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAuthStore from '../_store/useAuthStore';
import ApiService from '../_lib/services/ApiService';
import ReviewModal from '../_components/ReviewModal';
import {
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaUser,
  FaUserCircle,
  FaStar,
  FaInfoCircle,
  FaWindowClose,
  FaClock,
  FaCouch,
  FaChevronRight,
} from 'react-icons/fa';

// Add CSS animations at the top of the file
const cardAnimations = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes statusPulse {
  0% { box-shadow: 0 0 0 0 rgba(73, 133, 38, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(73, 133, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(73, 133, 38, 0); }
}

@keyframes shine {
  0% { background-position: -100px; }
  60% { background-position: 140px; }
  100% { background-position: 140px; }
}
`;

export default function MyBookingsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [cancellingId, setCancellingId] = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  console.log(user);
  useEffect(() => {
    setMounted(true);

    if (mounted && !isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (mounted && isAuthenticated && user) {
      fetchBookings();
    }
  }, [isAuthenticated, router, mounted, user]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getUserBookings();
      if (
        response &&
        response.bookingHistory &&
        Array.isArray(response.bookingHistory)
      ) {
        setBookings(response.bookingHistory);
      } else {
        setBookings([]);
        setMessage({ text: 'No bookings data available', type: 'info' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to load bookings', type: 'error' });
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      await ApiService.cancelBooking(bookingId);
      setBookings(
        bookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      setMessage({ text: 'Booking cancelled successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to cancel booking', type: 'error' });
    } finally {
      setCancellingId(null);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedBooking(null);
  };

  const handleSubmitReview = async ({ rating, reviewText }) => {
    try {
      setSubmitLoading(true);
      const reviewData = {
        eventId: parseInt(selectedBooking?.eventId),
        score: rating,
        review: reviewText,
      };
      await ApiService.postReview(reviewData);
      setMessage({ text: 'Review submitted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to submit review', type: 'error' });
    } finally {
      setSubmitLoading(false);
      handleCloseReviewModal();
    }
  };

  const getFilteredBookings = () => {
    const today = new Date();

    if (bookingFilter === 'all') return bookings;

    if (bookingFilter === 'upcoming') {
      return bookings.filter(
        (booking) =>
          new Date(booking.startTime) >= today && booking.status !== 'cancelled'
      );
    }

    if (bookingFilter === 'past') {
      return bookings.filter(
        (booking) =>
          new Date(booking.endTime) < today && booking.status !== 'cancelled'
      );
    }

    if (bookingFilter === 'cancelled') {
      return bookings.filter((booking) => booking.status === 'cancelled');
    }

    return bookings;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Skip rendering anything meaningful during SSR
  if (!mounted) {
    return <div className="min-h-screen pt-20"></div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center bg-[#FDFAF6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#498526]"></div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#FDFAF6]">
      {/* Add the animation styles */}
      <style jsx global>
        {cardAnimations}
      </style>

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#498526]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#498526] font-medium">My Bookings</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="bg-[#EBF5E0] w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.profilePhoto ? (
                    <Image
                      src={user?.profilePhoto}
                      // alt={fullName}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      priority
                    />
                  ) : (
                    <FaUserCircle className="text-[#498526] w-16 h-16" />
                  )}
                </div>

                <h2 className="text-xl font-bold text-[#255F38] mb-1">
                  My Account
                </h2>
                <p className="text-gray-500">Manage your bookings</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#498526] py-3 px-6 text-white font-medium">
                Navigation
              </div>
              <div className="p-2">
                <Link
                  href="/my-profile"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <FaUser className="text-[#99BC85]" />
                  Profile Information
                </Link>
                <Link
                  href="/my-bookings"
                  className="flex items-center gap-3 p-3 rounded-md bg-[#EBF5E0] text-[#255F38] font-medium"
                >
                  <FaTicketAlt className="text-[#99BC85]" />
                  My Bookings
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#498526] p-6 text-white">
                <h1 className="text-2xl font-bold">My Event Bookings</h1>
              </div>

              {message.text && (
                <div
                  className={`p-4 ${
                    message.type === 'error'
                      ? 'bg-red-50 text-red-600'
                      : message.type === 'success'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-blue-50 text-blue-600'
                  } flex items-center`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      message.type === 'error'
                        ? 'bg-red-600'
                        : message.type === 'success'
                        ? 'bg-green-600'
                        : 'bg-blue-600'
                    }`}
                  ></div>
                  {message.text}
                </div>
              )}

              <div className="p-6">
                {/* Filter buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setBookingFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      bookingFilter === 'all'
                        ? 'bg-[#498526] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Bookings
                  </button>
                  <button
                    onClick={() => setBookingFilter('upcoming')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      bookingFilter === 'upcoming'
                        ? 'bg-[#498526] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setBookingFilter('past')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      bookingFilter === 'past'
                        ? 'bg-[#498526] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Past
                  </button>
                  <button
                    onClick={() => setBookingFilter('cancelled')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      bookingFilter === 'cancelled'
                        ? 'bg-[#498526] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="bg-[#EBF5E0] p-8 rounded-lg text-center">
                    <div className="flex justify-center mb-4">
                      <FaInfoCircle className="text-[#498526] w-12 h-12" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#255F38] mb-3">
                      No bookings found
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {bookingFilter === 'all'
                        ? "You don't have any event bookings yet. Start exploring events!"
                        : `No ${bookingFilter} bookings found.`}
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="px-6 py-3 bg-[#498526] text-white rounded-lg hover:bg-[#3B6B1E] transition"
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredBookings.map((booking, index) => (
                      <div
                        key={booking.bookingId}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{
                          animation: `fadeIn 0.6s ease-out ${
                            index * 0.1
                          }s both`,
                          background:
                            'linear-gradient(to right, white, #f9fdf6)',
                          transformOrigin: 'center',
                        }}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div
                            className="relative md:w-1/3 h-64 md:h-auto overflow-hidden"
                            style={{
                              background:
                                'linear-gradient(135deg, #EBF5E0 0%, #cde5b0 100%)',
                            }}
                          >
                            <div
                              className="absolute inset-0 bg-pattern opacity-10"
                              style={{
                                backgroundImage:
                                  "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23498526' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                              }}
                            ></div>

                            <div className="text-center p-6 relative z-10 h-full flex flex-col justify-center items-center">
                              <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center mb-4 shadow-md transform transition-transform duration-300 hover:scale-110">
                                <FaTicketAlt className="text-[#498526] w-12 h-12" />
                              </div>
                              <h3 className="text-lg font-bold text-[#255F38] mb-1">
                                {booking.eventName}
                              </h3>
                              <div className="flex items-center justify-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                                <FaStar className="text-amber-500" />
                                <p className="text-[#498526] font-medium">
                                  Session #{booking.sessionId}
                                </p>
                              </div>
                            </div>

                            {/* Status badge with animation */}
                            <div className="absolute top-3 left-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                                  !booking.status ||
                                  booking.status === 'confirmed'
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                    : booking.status === 'pending'
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                                    : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                                }`}
                                style={{
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                  animation:
                                    (!booking.status ||
                                      booking.status === 'confirmed') &&
                                    new Date(booking.startTime) > new Date()
                                      ? 'statusPulse 2s infinite'
                                      : 'none',
                                }}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    !booking.status ||
                                    booking.status === 'confirmed'
                                      ? 'bg-white'
                                      : booking.status === 'pending'
                                      ? 'bg-white'
                                      : 'bg-white'
                                  }`}
                                ></span>
                                {booking.status
                                  ? booking.status.charAt(0).toUpperCase() +
                                    booking.status.slice(1)
                                  : 'Confirmed'}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 md:w-2/3 relative">
                            <div className="flex justify-between items-start mb-4">
                              <h2 className="text-xl font-bold text-[#255F38] relative group">
                                {booking.eventName}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#498526] transition-all duration-300 group-hover:w-full"></span>
                              </h2>
                            </div>

                            <p className="text-gray-600 mb-5 flex items-center gap-2 group transition-all duration-300 hover:text-[#498526]">
                              <div className="bg-[#EBF5E0] p-1.5 rounded-md group-hover:bg-[#498526] group-hover:text-white transition-all duration-300">
                                <FaMapMarkerAlt />
                              </div>
                              <span>
                                {booking.locationName}, {booking.address}
                              </span>
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                              <div className="flex items-center gap-3 transform transition-transform duration-300 hover:translate-x-1">
                                <div className="bg-[#EBF5E0] p-2.5 rounded-md shadow-sm">
                                  <FaCalendarAlt className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-amber-900 uppercase tracking-wide font-medium">
                                    Date
                                  </p>
                                  <p className="font-medium text-green-800">
                                    {formatDate(booking.startTime)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 transform transition-transform duration-300 hover:translate-x-1">
                                <div className="bg-[#EBF5E0] p-2.5 rounded-md shadow-sm">
                                  <FaClock className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-amber-900 uppercase tracking-wide font-medium">
                                    Time
                                  </p>
                                  <p className="font-medium text-green-800">
                                    {formatTime(booking.startTime)} -{' '}
                                    {formatTime(booking.endTime)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 transform transition-transform duration-300 hover:translate-x-1">
                                <div className="bg-[#EBF5E0] p-2.5 rounded-md shadow-sm">
                                  <FaUsers className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-amber-900 uppercase tracking-wide font-medium">
                                    Seats
                                  </p>
                                  <p className="font-medium text-green-800">
                                    {booking.seatCount}{' '}
                                    {booking.seatCount > 1
                                      ? 'tickets'
                                      : 'ticket'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 transform transition-transform duration-300 hover:translate-x-1">
                                <div className="bg-[#EBF5E0] p-2.5 rounded-md shadow-sm">
                                  <FaCouch className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-amber-900 uppercase tracking-wide font-medium">
                                    Seat Numbers
                                  </p>
                                  <p className="font-medium text-green-800">
                                    {booking.seatNumber.join(', ')}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <div className="inline-block relative overflow-hidden">
                                  <FaMoneyBillWave className="text-[#99BC85] text-2xl relative z-10" />
                                  <span className="absolute inset-0 bg-[#EBF5E0] transform -skew-x-12 z-0"></span>
                                </div>
                                <span className="font-bold text-xl text-[#498526]">
                                  Booking #{booking.bookingId}
                                </span>
                              </div>

                              <div className="flex gap-3 mt-3 md:mt-0">
                                {(!booking.status ||
                                  booking.status !== 'cancelled') &&
                                  new Date(booking.startTime) > new Date() && (
                                    <button
                                      onClick={() =>
                                        handleCancelBooking(booking.bookingId)
                                      }
                                      disabled={
                                        cancellingId === booking.bookingId
                                      }
                                      className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                      <FaWindowClose />
                                      <span>
                                        {cancellingId === booking.bookingId
                                          ? 'Cancelling...'
                                          : 'Cancel'}
                                      </span>
                                    </button>
                                  )}

                                {new Date(booking.endTime) < new Date() &&
                                  booking.status !== 'cancelled' && (
                                    <button
                                      onClick={() =>
                                        handleOpenReviewModal(booking)
                                      }
                                      className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                      <span>Write Review</span>
                                    </button>
                                  )}

                                <Link
                                  href={`/event/${booking.eventId}`}
                                  className="px-5 py-2.5 bg-gradient-to-r from-[#99BC85] to-[#498526] text-white rounded-lg hover:from-[#7da369] hover:to-[#3B6B1E] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                  <span>View Event</span>
                                  <FaChevronRight className="text-sm" />
                                </Link>
                              </div>
                            </div>

                            {/* Event tag */}
                            {new Date(booking.startTime) > new Date() &&
                              (!booking.status ||
                                booking.status !== 'cancelled') && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold py-1 px-3 rotate-0 transform origin-top-right shadow-md">
                                  Upcoming
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        onSubmit={handleSubmitReview}
        submitLoading={submitLoading}
      />
    </div>
  );
}
