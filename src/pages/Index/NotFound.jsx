// src/NotFound.js

import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-700">404</h1>
        <p className="mt-4 text-xl text-gray-500">Not Found</p>
        <p className="mt-2 text-gray-400">The resource requested could not be found on this server!</p>
      </div>
    </div>
  );
};

export default NotFound;