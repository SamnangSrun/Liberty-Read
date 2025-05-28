import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Import your images
import box from '../../Img/Admin/box.png'; 
import book from '../../Img/Admin/book.png'; 
import home from '../../Img/Admin/home.png'; 
import sell from '../../Img/Admin/sell.png'; 
import setting from '../../Img/Admin/setting.png'; 
import spp from '../../Img/Admin/spp.png'; 
import grow from '../../Img/Admin/grow.png'; 
import boxx from '../../Img/Admin/boxx.png'; 

// Reusable Dropdown Component
const Dropdown = ({ title, imgSrc, links }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="mb-1">
      <div 
        className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={title}
      >
        <div className="flex items-center">
          <img src={imgSrc} alt={title} className="mr-3 h-5 w-5" />
          <span className="font-medium">{title}</span>
        </div>
        <FontAwesomeIcon 
          icon={isOpen ? faChevronUp : faChevronDown} 
          className="h-3 w-3 text-gray-500"
        />
      </div>
      {isOpen && (
        <ul id={title} className="ml-8 mt-1 space-y-1">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink 
                to={link.path}
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`
                }
              >
                {link.imgSrc && <img src={link.imgSrc} alt={link.label} className="mr-3 h-4 w-4" />}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Home Link */}
      <NavLink 
        to="/admin/home"
        className={({ isActive }) => 
          `flex items-center p-3 mb-2 rounded-lg ${
            isActive 
              ? 'bg-blue-50 text-blue-600 font-medium' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`
        }
      >
        <img src={home} alt="Home" className="mr-3 h-5 w-5" />
        <span>Home</span>
      </NavLink>

      {/* Book Management Link */}
      <NavLink 
        to="/seller/book-management"
        className={({ isActive }) => 
          `flex items-center p-3 mb-2 rounded-lg ${
            isActive 
              ? 'bg-blue-50 text-blue-600 font-medium' 
              : 'hover:bg-gray-100 text-gray-700'
          }`
        }
      >
        <img src={book} alt="Book Management" className="mr-3 h-5 w-5" />
        <span>Book Management</span>
      </NavLink>

      {/* Order Management Dropdown */}
      <Dropdown
        title="Order Management"
        imgSrc={box} 
        links={[
          { imgSrc: grow, path: "/seller/view-order", label: "View Orders" },
          { imgSrc: boxx, path: "/seller/order-status", label: "Order Status Update" },
        ]}
      />

      {/* Bottom Section - Support and Settings */}
      <div className="mt-auto pt-2 border-t border-gray-200">
        <NavLink 
          to="/admin/support"
          className={({ isActive }) => 
            `flex items-center p-3 mb-2 rounded-lg ${
              isActive 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'hover:bg-gray-100 text-gray-700'
            }`
          }
        >
          <img src={spp} alt="Support" className="mr-3 h-5 w-5" />
          <span>Support</span>
        </NavLink>
        <NavLink 
          to="/admin/settings"
          className={({ isActive }) => 
            `flex items-center p-3 rounded-lg ${
              isActive 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'hover:bg-gray-100 text-gray-700'
            }`
          }
        >
          <img src={setting} alt="Settings" className="mr-3 h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;