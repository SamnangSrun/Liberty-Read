import React, { useState } from 'react';
import Navbar from '../Components/Index/Navbar.jsx';
import Sidebar from '../Components/Admin/Sidebar';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar - fixed at top */}
      <Navbar />

      {/* Mobile Toggle Button - fixed below navbar */}
      <div className="md:hidden p-2 fixed top-16 left-0 z-40">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-700 focus:outline-none"
        >
          <FontAwesomeIcon 
            icon={isSidebarOpen ? faTimes : faBars} 
            className="h-6 w-6" 
          />
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar - fixed position */}
        <div
          className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-md
            transform transition-transform duration-300 ease-in-out z-30
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
          />
        )}

        {/* Main Content - scrollable with sidebar margin */}
        <main className="flex-1 overflow-y-auto ml-0 md:ml-64 p-4 md:p-6 lg:p-2">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;