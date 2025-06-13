import React from 'react';
import BookImage from '../../Img/Index/Hero/book.png'; 
import { useNavigate } from 'react-router-dom';
import { profileStore } from '../../store/Pfile_store'; // adjust if your store path is different

const HeroSection = () => {
  const navigate = useNavigate();
  const access_token = profileStore((state) => state.access_token); // get token from store

  const handleGetStarted = () => {
    if (access_token) {
      navigate('/books');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Text Content */}
      <div className="md:w-1/2 order-2 md:order-1 text-center md:text-left mt-8 md:mt-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#444444] leading-tight">
          Liberty Reads, <br className="hidden sm:block" /> Your Gateway To Great Books
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#444444] max-w-md mx-auto md:mx-0">
          Discover a world of knowledge and imagination. Explore our collection, find your next great read, and let your journey begin.
        </p>
        <div className="mt-6 md:mt-8">
          <button
            onClick={handleGetStarted}
            className="border border-[#102249] text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 hover:text-white transition duration-200 inline-block"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="md:w-1/2 order-1 md:order-2 flex justify-center md:justify-end">
        <div className="w-56 sm:w-64 md:w-72 transform hover:scale-105 transition-transform duration-300">
          <img 
            src={BookImage} 
            alt="Books" 
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
