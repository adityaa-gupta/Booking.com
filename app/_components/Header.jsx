'use client';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useRouter, useSearchParams } from 'next/navigation';

// Fallback component for Suspense
const HeaderFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-900">
    <div className="animate-pulse text-white text-2xl">Loading...</div>
  </div>
);

// Component that uses useSearchParams
const HeaderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const slides = [
    {
      name: 'Watch Movies',
      image: '/images/movie.jpg',
      heading: 'Watch Absolute Stunning Movies',
      description: 'Enjoy the latest movies in the comfort of your home.',
      link: 'type=2',
    },
    {
      name: 'Book Ticket Now',
      image: '/images/concert.jpg',
      heading: 'Book Tickets for Concerts',
      description: 'Experience live music and thrilling performances.',
      link: 'type=1',
    },
    {
      name: 'Book Ticket Now',
      image: '/images/organization.jpg',
      heading: 'Book Tickets for Events',
      description: 'Discover amazing events happening around you.',
      link: 'type=3',
    },
  ];

  const handleExplore = (link) => {
    // Create a new URLSearchParams object with current params
    const params = new URLSearchParams(searchParams.toString());

    // Parse the link and update params
    const [param, value] = link.split('=');
    params.set(param, value);

    // Update the URL without a full page reload
    router.push(`?${params.toString()}`);
  };

  return (
    <Carousel
      showArrows={false}
      autoPlay
      infiniteLoop
      interval={2000}
      showThumbs={false}
      showStatus={false}
      stopOnHover
      className="w-full h-full"
    >
      {slides.map((slide, index) => (
        <div key={index} className="relative w-full h-screen">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.8)',
            }}
          />

          {/* Content Section */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 md:px-20">
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg animate-fadeIn">
              {slide.heading}
            </h1>
            <p className="text-lg md:text-xl mt-4 drop-shadow-md">
              {slide.description}
            </p>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleExplore(slide.link);
              }}
              className="mt-6 px-6 py-3 cursor-pointer text-lg font-semibold bg-[#99BC85] hover:bg-[#88A372] text-white rounded-full transition-all duration-300 shadow-lg"
            >
              Explore Now
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

// Main component with Suspense boundary
const HeaderCarousel = () => {
  return (
    <header className="w-full h-screen relative">
      <Suspense fallback={<HeaderFallback />}>
        <HeaderContent />
      </Suspense>
    </header>
  );
};

export default HeaderCarousel;
