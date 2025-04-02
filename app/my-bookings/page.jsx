'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAuthStore from '../_store/useAuthStore';
import ApiService from '../_lib/services/ApiService';
import {
  FaCalendarAlt,
  FaUsers,
  FaBed,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaUser,
  FaUserCircle,
  FaStar,
  FaInfoCircle,
  FaWindowClose,
} from 'react-icons/fa';

export default function MyBookingsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [cancellingId, setCancellingId] = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'

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
      const data = await ApiService.getUserBookings();
      if (Array.isArray(data)) {
        setBookings(data);
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
          booking.id === bookingId
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

  const getFilteredBookings = () => {
    const today = new Date();

    if (bookingFilter === 'all') return bookings;

    if (bookingFilter === 'upcoming') {
      return bookings.filter(
        (booking) =>
          new Date(booking.checkInDate) >= today &&
          booking.status !== 'cancelled'
      );
    }

    if (bookingFilter === 'past') {
      return bookings.filter(
        (booking) =>
          new Date(booking.checkOutDate) < today &&
          booking.status !== 'cancelled'
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
                <div className="bg-[#EBF5E0] p-5 rounded-full mb-4">
                  <FaUserCircle className="text-[#498526] w-16 h-16" />
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
                  <FaMapMarkerAlt className="text-[#99BC85]" />
                  My Bookings
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#498526] p-6 text-white">
                <h1 className="text-2xl font-bold">My Bookings</h1>
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
                        ? "You don't have any bookings yet. Start exploring accommodations!"
                        : `No ${bookingFilter} bookings found.`}
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="px-6 py-3 bg-[#498526] text-white rounded-lg hover:bg-[#3B6B1E] transition"
                    >
                      Browse Accommodations
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative md:w-1/3 h-56 md:h-auto">
                            <Image
                              src={
                                booking.property.imageUrl ||
                                '/images/placeholder.jpg'
                              }
                              alt={booking.property.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />

                            {/* Status badge */}
                            <div className="absolute top-3 left-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-500 text-white'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-red-500 text-white'
                                }`}
                              >
                                {booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 md:w-2/3">
                            <div className="flex justify-between items-start mb-3">
                              <h2 className="text-xl font-bold text-[#255F38]">
                                {booking.property.name}
                              </h2>
                              <div className="flex items-center">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span className="font-medium">{4.5}</span>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4 flex items-center gap-1">
                              <FaMapMarkerAlt className="text-[#99BC85]" />
                              {booking.property.location}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center gap-2">
                                <div className="bg-[#EBF5E0] p-2 rounded-md">
                                  <FaCalendarAlt className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Check-in
                                  </p>
                                  <p className="font-medium">
                                    {formatDate(booking.checkInDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="bg-[#EBF5E0] p-2 rounded-md">
                                  <FaCalendarAlt className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Check-out
                                  </p>
                                  <p className="font-medium">
                                    {formatDate(booking.checkOutDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="bg-[#EBF5E0] p-2 rounded-md">
                                  <FaUsers className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Guests
                                  </p>
                                  <p className="font-medium">
                                    {booking.guestCount}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="bg-[#EBF5E0] p-2 rounded-md">
                                  <FaBed className="text-[#498526]" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Room Type
                                  </p>
                                  <p className="font-medium">
                                    {booking.roomType}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <FaMoneyBillWave className="text-[#99BC85]" />
                                <span className="font-bold text-xl text-[#498526]">
                                  ${booking.totalPrice.toFixed(2)}
                                </span>
                              </div>

                              <div className="flex gap-2 mt-3 md:mt-0">
                                {booking.status !== 'cancelled' && (
                                  <button
                                    onClick={() =>
                                      handleCancelBooking(booking.id)
                                    }
                                    disabled={cancellingId === booking.id}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-1"
                                  >
                                    <FaWindowClose />
                                    {cancellingId === booking.id
                                      ? 'Cancelling...'
                                      : 'Cancel'}
                                  </button>
                                )}

                                <Link
                                  href={`/properties/${booking.property.id}`}
                                  className="px-4 py-2 bg-[#99BC85] text-white rounded-lg hover:bg-[#7da369] transition"
                                >
                                  View Property
                                </Link>
                              </div>
                            </div>
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
    </div>
  );
}
