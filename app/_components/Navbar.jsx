'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import useAuthStore from '../_store/useAuthStore';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const pathname = usePathname();
  if (pathname?.includes('/admin')) return <></>;

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowDropdown(false);
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
            className="px-4 py-2 w-80 text-[#255F38] border-none outline-none "
            placeholder="Search for places, hotels..."
          />
          <button className="p-2 px-4 ">
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
              <FaUserCircle size={24} className="text-[#498526]" />
              <span className="font-medium text-[#255F38]">
                {user.name || user.email || 'User'}
              </span>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  href="/bookings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
