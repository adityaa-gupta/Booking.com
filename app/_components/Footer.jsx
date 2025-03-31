'use client';
import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#255F38] text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">Booking.com</h2>
            <p className="text-sm mt-2 text-[#E4EFE7]">
              Your one-stop solution for booking events, venues, and more.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row gap-6 text-center">
            <Link href="/" className="hover:text-[#99BC85] transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-[#99BC85] transition">
              About
            </Link>
            <Link href="/services" className="hover:text-[#99BC85] transition">
              Services
            </Link>
            <Link href="/contact" className="hover:text-[#99BC85] transition">
              Contact
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#1F7D53] rounded-full hover:bg-[#145A3A] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#1F7D53] rounded-full hover:bg-[#145A3A] transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#1F7D53] rounded-full hover:bg-[#145A3A] transition"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#99BC85]"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#E4EFE7]">
          <p>© {new Date().getFullYear()} Booking.com. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#99BC85] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#99BC85] transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
