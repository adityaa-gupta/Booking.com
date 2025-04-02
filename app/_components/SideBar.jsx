'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdOutlineEventAvailable } from 'react-icons/md';
import { FaChair, FaLocationArrow } from 'react-icons/fa';
import './SideBar.css'; // Import the CSS file for styling

const SideBar = () => {
  const pathname = usePathname();
  const links = [
    {
      name: 'Events',
      link: '/admin/events',
      icon: <MdOutlineEventAvailable />,
      selected: false,
    },
    {
      name: 'Venue',
      link: '/admin/venue',
      icon: <FaLocationArrow />,
      selected: false,
    },
    {
      name: 'Sections',
      link: '/admin/section',
      icon: <FaChair />,
      selected: false,
    },
    {
      name: 'Sessions',
      link: '/admin/session',
      icon: <FaChair />,
      selected: false,
    },
  ];

  console.log(pathname);
  return (
    <div className="sidebar bg-[#FAF1E6] p-8 flex flex-col gap-4 justify-between h-screen shadow-lg">
      <div className="flex items-center flex-col gap-10">
        <Link
          href="/admin"
          className="flex items-center text-[#1F7D53] text-2xl space-x-2 logo"
        >
          <MdOutlineEventAvailable />
          <span>Seatly</span>
        </Link>

        <div className="flex flex-col gap-2">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className={`flex items-center space-x-2 py-3 px-8 text-xl rounded-lg link ${
                pathname === link.link ? 'active' : ''
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <Link
          href="/auth"
          className="bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
