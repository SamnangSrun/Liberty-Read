import React from 'react';
import C from '../../../Img/Index/Hero/Children.png';

const ChildrensBooks = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <p className="text-lg font-bold mb-2">Categories</p>
      <h2 className="text-3xl font-bold mb-2">Children's Books</h2>
      <p className="mb-6 text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      <div className="flex flex-col md:flex-row border border-black  gap-4">
        <div className="flex-shrink-0">
          <img
            src={C}
            alt="A Tale of Green Gables"
            className="w-[700px] "
          />
        </div>
        <div className='ml-10 mt-10' >
          <h3 className="text-sm  font-semibold bg-[#EEEEEE] w-16 ">Category</h3>
          <h1 className="text-2xl mt-2 font-bold"> Children's Books </h1>
          <p className=" mt-2">
            A classic story about the adventures of Anne Shirley, an imaginative girl with a fiery spirit.
          </p>
        </div>
      </div>

      
       
    </div>
  );
};

export default ChildrensBooks;