'use client';
import Image from 'next/image';
import HeaderCarousel from './_components/Header';
import Events from './_components/Events';

const Home = () => {
  return (
    <div className="bg-white ">
      <HeaderCarousel />
      <Events />
    </div>
  );
};

export default Home;
