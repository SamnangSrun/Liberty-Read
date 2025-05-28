// src/components/BookCategories.js
import React, { useRef, useState } from 'react';
import Fitness from './Fitness'; // Adjust the path as necessary
import Cooking from './Cooking'; // Adjust the path as necessary

const BookCategories = () => {
  const fitnessRef = useRef(null);
  const cookingRef = useRef(null);
  const [showAll, setShowAll] = useState(false); // State to manage visibility of all cards

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Categories Navigation */}
      <div className="flex space-x-4 mb-4 text-[#102249]">
        <button onClick={() => scrollToSection(fitnessRef)} className=" hover:underline">
          Fitness & Well-being
        </button>
        <button onClick={() => scrollToSection(cookingRef)} className=" hover:underline"showAll={showAll} setShowAll={setShowAll}>
          Cooking & Recipes
        </button>
      </div>

      {/* Content Sections */}
      <div ref={fitnessRef} className="mb-8">
        <Fitness showAll={showAll} setShowAll={setShowAll} />
      </div>

      <div ref={cookingRef} className="mb-8">
       
        <Cooking showAll={showAll} setShowAll={setShowAll}/>
      </div>
    </div>
  );
};

export default BookCategories;