import React, { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import book2 from '../../Img/Index/Hero/Book2.png';

const FAQ = () => {
  const questions = [
    {
      question: 'How can I place an order?',
      answer: 'To place an order, simply browse our collection, add items to your cart, and proceed to checkout.',
    },
    {
      question: 'Do you have a physical store?',
      answer: 'Currently, we operate online only, but we offer a wide range of titles available for delivery.',
    },
    {
      question: 'Do you offer worldwide shipping?',
      answer: 'Yes, we ship to various countries around the world! Check our shipping policy for more details.',
    },
    {
      question: 'Can I return or exchange a book?',
      answer: 'We accept returns and exchanges within 14 days of purchase if the book is in its original condition. Digital books and special orders are non-refundable.',
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white max-w-7xl mx-auto">
      {/* Text Content */}
      <div className="w-full md:w-1/2 md:pr-8">
        <div className="text-start mb-6 md:mb-8">
          <p className="text-sm font-bold text-[#102249]">Questions</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#102249] mt-2">Still Have Questions?</h1>
          <p className="text-[#667085] mt-3">
            We're happy that more and more book lovers choose Liberty Library for their reading needs.
          </p>
        </div>
        
        {/* FAQ Items */}
        <ul className="space-y-3 w-full">
          {questions.map((item, index) => (
            <li 
              key={index} 
              className="bg-white p-4 rounded-lg border-b border-gray-300 cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-semibold text-[#102249]">
                  {item.question}
                </h3>
                <span className="ml-4">
                  {openIndex === index ? 
                    <HiChevronUp className="text-xl text-[#102249]" /> : 
                    <HiChevronDown className="text-xl text-[#102249]" />
                  }
                </span>
              </div>
              {openIndex === index && (
                <p className="text-gray-600 mt-3 text-sm md:text-base">
                  {item.answer}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Image - Hidden on mobile */}
      <div className="hidden md:block w-1/2 pl-8 mt-8 md:mt-0">
        <img 
          src={book2} 
          alt="Book" 
          className="w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-300" 
        />
      </div>
    </div>
  );
};

export default FAQ;