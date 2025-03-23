"use client";
import Link from "next/link";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HeaderCarousel = () => {
  const slides = [
    {
      name: "Watch Movies",
      image: "/images/movie.jpg",
      heading: "Watch Absolute Stunning Movies",
      description: "Enjoy the latest movies in the comfort of your home.",
      link: "/events/movies",
    },
    {
      name: "Book Ticket Now",
      image: "/images/concert.jpg",
      heading: "Book Tickets for Concerts",
      description: "Experience live music and thrilling performances.",
      link: "/events/concerts",
    },
    {
      name: "Book Ticket Now",
      image: "/images/organization.jpg",
      heading: "Book Tickets for Events",
      description: "Discover amazing events happening around you.",
      link: "/events/organizational",
    },
  ];

  return (
    <header className="w-full h-screen relative">
      <Carousel
        showArrows={false}
        autoPlay
        infiniteLoop
        interval={4000}
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
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.8)",
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
              <Link
                href={slide.link}
                className="mt-6 px-6 py-3 text-lg font-semibold bg-[#99BC85] hover:bg-[#88A372] text-white rounded-full transition-all duration-300 shadow-lg"
              >
                Explore Now
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </header>
  );
};

export default HeaderCarousel;
