import React from 'react';
import { FaTruck, FaClock, FaCreditCard, FaShoppingCart } from 'react-icons/fa';

const services = [
  {
    title: 'Fast Delivery',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis, nunc a pretium viverra.',
    icon: <FaTruck className="h-6 w-6 text-[#102249] inline-block mr-2" />,
  },
  {
    title: 'Open 24 Hour',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis, nunc a pretium viverra.',
    icon: <FaClock className="h-6 w-6 text-[#102249] inline-block mr-2" />,
  },
  {
    title: 'Online Payment',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis, nunc a pretium viverra.',
    icon: <FaCreditCard className="h-6 w-6 text-[#102249] inline-block mr-2" />,
  },
  {
    title: 'Online Order',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis, nunc a pretium viverra.',
    icon: <FaShoppingCart className="h-6 w-6 text-[#102249] inline-block mr-2" />,
  },
];

const ServiceCards = () => {
  return (
    <div className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {service.icon}
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                {service.title}
              </h3>
            </div>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-700">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;