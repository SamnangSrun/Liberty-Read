import React from 'react';

const Feedbacks = () => {
  const reviews = [
    {
      title: 'Anime Film',
      date: 'February 15, 2025',
      content: "I love how easy it is to order from Liberty Library! The website is well-organized, and the recommendations are spot on. I've discovered some amazing books here, and the prices are great! Will definitely be back for more!"
    },
    {
      title: 'Novel Book',
      date: 'January 22, 2025',
      content: "Liberty Library has been my go-to bookshop for months! Their collection is diverse, and I always find the books I'm looking for. The delivery is fast, and the quality of the books is excellent. I highly recommend it to all book lovers!"
    }
  ];

  return (
    <div className="px-4 sm:px-6 py-8 md:py-12 max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <p className="text-sm font-bold text-gray-800">Feedbacks</p>
        <h1 className="text-2xl md:text-3xl font-bold text-[#102249] mt-2">Our Customers' Reviews</h1>
        <p className="text-[#667085] mt-3 max-w-2xl mx-auto">
          We're happy that more and more book lovers choose Liberty Library for their reading needs.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6 md:gap-8">
        {reviews.map((review, index) => (
          <div 
            key={index} 
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-[#102249]/20 hover:border-[#102249]/50 transition-all w-full md:w-[400px] lg:w-[500px]"
          >
            <h3 className="text-lg sm:text-xl font-bold text-[#102249] text-center mb-3">{review.title}</h3>
            <p className="text-gray-700 text-sm sm:text-base">{review.content}</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-4 text-center">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;