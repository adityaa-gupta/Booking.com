'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import useAuthStore from '../_store/useAuthStore';
import Image from 'next/image';
import SearchComp from './SearchComp';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchActive(false);
  }, [pathname]);

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

  const toggleMobileSearch = () => {
    setMobileSearchActive(!mobileSearchActive);
    if (!mobileMenuOpen) {
      setMobileMenuOpen(true);
    }
  };

  const handleSearchResultClick = () => {
    setMobileMenuOpen(false);
    setMobileSearchActive(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#FDFAF6] shadow-md z-50">
      <div className="flex items-center justify-between p-4">
        <Link
          href="/"
          className="font-bold text-2xl md:text-3xl text-[#498526] z-20"
        >
          Seatly
        </Link>

        {/* Search Bar - Hidden on mobile, visible on larger screens */}
        <div className="hidden md:block">
          <SearchComp />
        </div>

        {/* Mobile Search Icon */}
        <button
          className="md:hidden p-2 text-[#498526] z-20"
          onClick={toggleMobileSearch}
          aria-label="Search"
        >
          <FaSearch size={20} />
        </button>

        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:block">
          <ul className="flex gap-5 lg:gap-10 font-semibold text-[#99BC85]">
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

        {/* User Profile or Sign In Button - Adaptive for mobile */}
        <div className="hidden md:block">
          {isAuthenticated && user ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.profilePhoto ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
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

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden z-20 text-[#498526]"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            if (mobileMenuOpen) {
              setMobileSearchActive(false);
            }
          }}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => {
            setMobileMenuOpen(false);
            setMobileSearchActive(false);
          }}
        ></div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 w-3/4 h-full bg-white z-10 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-20 px-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchComp
                isMobile={true}
                onResultClick={handleSearchResultClick}
              />
            </div>

            {/* Mobile Navigation Links */}
            <ul className="flex flex-col gap-3 font-semibold text-[#99BC85] mt-2">
              <li className="hover:text-black cursor-pointer p-2 border-b border-gray-100">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="hover:text-black cursor-pointer p-2 border-b border-gray-100">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li className="hover:text-black cursor-pointer p-2 border-b border-gray-100">
                <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
                  Services
                </Link>
              </li>
              <li className="hover:text-black cursor-pointer p-2 border-b border-gray-100">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>

            {/* Mobile User Profile Section */}
            <div className="mt-auto mb-10">
              {isAuthenticated && user ? (
                <div className="p-4 bg-[#f8f8f8] rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    {user.profilePhoto ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={user.profilePhoto}
                          alt={getUserDisplayName()}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <FaUserCircle size={32} className="text-[#498526]" />
                    )}
                    <span className="font-medium text-[#255F38]">
                      {getUserDisplayName()}
                    </span>
                  </div>

                  <Link
                    href="/my-profile"
                    className="block w-full py-2 mb-2 text-center bg-white rounded-lg text-[#498526] shadow-sm"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="block w-full py-2 mb-2 text-center bg-white rounded-lg text-[#498526] shadow-sm"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full py-2 text-center bg-red-50 rounded-lg text-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="block w-full text-center bg-black text-white px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
