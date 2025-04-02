'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import useAuthStore from '../_store/useAuthStore';
import Image from 'next/image';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render navbar on admin pages
  if (pathname?.includes('/admin')) return null;

  // Render a placeholder during server-side rendering
  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 w-full bg-[#FDFAF6] shadow-md z-50 h-16"></div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowDropdown(false);
  };

  // Get user display name safely
  const getUserDisplayName = () => {
    if (!user) return 'User';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.name) {
      return user.name;
    }

    return user.email || 'User';
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#FDFAF6] shadow-md z-50">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-3xl text-[#498526]">
          Booking.com
        </Link>

        {/* Search Bar */}
        <div className="flex items-center border border-[#255F38] rounded-full overflow-hidden shadow-sm">
          <input
            type="text"
            className="px-4 py-2 w-80 text-[#255F38] border-none outline-none"
            placeholder="Search for places, hotels..."
          />
          <button className="p-2 px-4">
            <FaSearch size={18} className="text-[#99BC85]" />
          </button>
        </div>

        {/* Navigation Links */}
        <div>
          <ul className="flex gap-10 font-semibold text-[#99BC85]">
            <li className="hover:text-black cursor-pointer">
              <Link href="/">Home</Link>
            </li>
            <li className="hover:text-black cursor-pointer">
              <Link href="/about">About</Link>
            </li>
            <li className="hover:text-black cursor-pointer">
              <Link href="/services">Services</Link>
            </li>
            <li className="hover:text-black cursor-pointer">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* User Profile or Sign In Button */}
        {isAuthenticated && user ? (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user.profilePhoto ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user.profilePhoto}
                    alt={getUserDisplayName()}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ) : (
                <FaUserCircle size={24} className="text-[#498526]" />
              )}
              <span className="font-medium text-[#255F38]">
                {getUserDisplayName()}
              </span>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/my-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/my-bookings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
