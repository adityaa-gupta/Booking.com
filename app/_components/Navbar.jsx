'use client';
import Link from 'next/link';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  if (pathname?.includes('/admin')) return <></>;
  return (
    <div className="fixed top-0 left-0 w-full bg-[#FDFAF6] shadow-md z-50">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-2xl text-[#99BC85]">
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
            <li className=" hover:text-black cursor-pointer">Home</li>
            <li className=" hover:text-black cursor-pointer">About</li>
            <li className=" hover:text-black cursor-pointer">Services</li>
            <li className=" hover:text-black cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Sign In Button */}
        <Link
          href="/auth"
          className="bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
