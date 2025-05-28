import React, { useState } from 'react';
import Sidebar from '../Components/Seller/Sidebar';
import { Outlet } from 'react-router-dom';
import Navbar from "../Components/Index/Navbar.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Seller() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar at the top - fixed */}
      <Navbar />

      {/* Mobile menu icon button - fixed below navbar */}
      <div className="md:hidden p-2 fixed top-16 left-0 z-40">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="text-gray-700 focus:outline-none"
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="h-6 w-6" />
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 pt-16"> {/* pt-16 to account for navbar height */}
        
        {/* Sidebar - fixed position */}
        <div
          className={`fixed top-16 left-0 bottom-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0`}
        >
          <Sidebar />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main content - scrollable area with margin for sidebar */}
        <main className="flex-1 ml-0 md:ml-64 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Seller;