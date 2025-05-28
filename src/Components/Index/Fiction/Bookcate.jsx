import React, { useRef, useState } from 'react';
import Classic from './Classic'; // Adjust the path as necessary
import Contemporary from './Contemporary'; // Adjust the path as necessary
import Romance from './Romance'; 
import Adventure from './Adventure'; 

const BookCategories = () => {
  const classicRef = useRef(null);
  const contemporaryRef = useRef(null);
  const romanceRef = useRef(null);
  const adventureRef = useRef(null);
  const [showAllClassic, setShowAllClassic] = useState(false); // State for Classic
  const [showAllContemporary, setShowAllContemporary] = useState(false); // State for Contemporary
  const [showAllRomance, setShowAllRomance] = useState(false); // State for Romance
  const [showAllAdventure, setShowAllAdventure] = useState(false); // State for Adventure

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Categories Navigation */}
      <div className="flex space-x-4 mb-4 text-[#102249]">
        <button onClick={() => scrollToSection(classicRef)} className="hover:underline">
          Classic Khmer Literature
        </button>
        <button onClick={() => scrollToSection(contemporaryRef)} className="hover:underline">
          Contemporary Novels
        </button>
        <button onClick={() => scrollToSection(adventureRef)} className="hover:underline">
          Adventure & Fantasy
        </button>
        <button onClick={() => scrollToSection(romanceRef)} className="hover:underline">
          Romance
        </button>
      </div>

      {/* Content Sections */}
      <div ref={classicRef} className="mb-8">
        <Classic showAll={showAllClassic} setShowAll={setShowAllClassic} />
      </div>

      <div ref={contemporaryRef} className="mb-8">
        <Contemporary showAll={showAllContemporary} setShowAll={setShowAllContemporary} />
      </div>

      <div ref={adventureRef} className="mb-8">
        <Adventure showAll={showAllAdventure} setShowAll={setShowAllAdventure} />
      </div>

      <div ref={romanceRef} className="mb-8">
        <Romance showAll={showAllRomance} setShowAll={setShowAllRomance} />
      </div>
    </div>
  );
};

export default BookCategories;