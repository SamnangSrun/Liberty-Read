
  import React, { useRef, useState } from 'react';
  import Business from './Business'; 
  import History from './History'; 
  import Help from './Self-Help'; 
  import Travel from './Travel'; 

  const BookCategories = () => {
    const business = useRef(null);
    const history = useRef(null);
    const travel = useRef(null);
    const help = useRef(null);
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
          <button onClick={() => scrollToSection(history)} className=" hover:underline">
          History & Biographies
          </button>
          <button onClick={() => scrollToSection(business)} className=" hover:underline"showAll={showAll} setShowAll={setShowAll}>
          Business & Economics
          </button>
          <button onClick={() => scrollToSection(help)} className=" hover:underline"showAll={showAll} setShowAll={setShowAll}>
          Self-Help & Motivation
          </button>
          <button onClick={() => scrollToSection(travel)} className=" hover:underline"showAll={showAll} setShowAll={setShowAll}>
          Travel & Culture
          </button>
        </div>

        {/* Content Sections */}
        <div ref={history} className="mb-8">
          <History showAll={showAll} setShowAll={setShowAll} />
        </div>

        <div ref={business} className="mb-8">
        
          <Business showAll={showAll} setShowAll={setShowAll}/>
        </div>
        <div ref={help} className="mb-8">
        
          <Help  showAll={showAll} setShowAll={setShowAll}/>
        </div>
        <div ref={travel} className="mb-8">
        
          <Travel showAll={showAll} setShowAll={setShowAll}/>
        </div>
      </div>
    );
  };

  export default BookCategories;