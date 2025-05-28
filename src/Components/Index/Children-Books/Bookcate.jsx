import React, { useRef, useState } from 'react';
import Comics from './Comics'; // Adjust the path as necessary
import Education from './Education'; // Adjust the path as necessary
import Fairy from './Fairy'; 
import Picture from './Picture'; 

const BookCategories = () => {
  const comics = useRef(null);
  const education = useRef(null);
  const fairy = useRef(null);
  const picture = useRef(null);
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
        <button onClick={() => scrollToSection(picture)} className="hover:underline">
        Picture Books
        </button>
        <button onClick={() => scrollToSection(education)} className="hover:underline">
        Educational Books
        </button>
        <button onClick={() => scrollToSection(fairy)} className="hover:underline">
        Fairy Tales & Folktales
        </button>
        <button onClick={() => scrollToSection(comics)} className="hover:underline">
        Comics & Graphic Novels
        </button>
      </div>

      {/* Content Sections */}
      <div ref={picture } className="mb-8">
        <Picture  showAll={showAllClassic} setShowAll={setShowAllClassic} />
      </div>

      <div ref={education} className="mb-8">
        <Education  showAll={showAllContemporary} setShowAll={setShowAllContemporary} />
      </div>

      <div ref={fairy} className="mb-8">
        <Fairy  showAll={showAllAdventure} setShowAll={setShowAllAdventure} />
      </div>

      <div ref={comics} className="mb-8">
        <Comics showAll={showAllRomance} setShowAll={setShowAllRomance} />
      </div>
    </div>
  );
};

export default BookCategories;