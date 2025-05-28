import { NavLink, useNavigate } from "react-router-dom";
import Black from "../../Img/Logo.png"; // Assuming the logo image path
import CartIcon from "../../Img/Index/Navbar/card.png";
import NotificationIcon from '../../Img/Index/Navbar/bell.png';
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { profileStore } from "../../store/Pfile_store"; // Assuming this is for user profile state management
import { config } from "../../utils/config"; // Assuming this contains configuration for image paths

export function NavbarAdmin() {
  const navigate = useNavigate();
  const { access_token, user, funLogout } = profileStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Admin Dashboard");

  const isLoggedIn = !!access_token;

  const handleLogout = () => {
    funLogout();
    navigate("/"); // Redirect to homepage after logging out
  };

  const handleCategoryClick = (title) => {
    setSelectedCategory(title);
    setDropdownOpen(false);
  };

  const defaultProfilePic = "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"; // Default image for profile
  const profilePic = user?.profile_image
    ? `${config.profile_image_path}${user.profile_image}`
    : defaultProfilePic; // Use either the API profile image or the default

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="block text-teal-600">
              <img src={Black} alt="Logo" className="w-40" />
            </NavLink>
          </div>

          {/* Admin-specific navigation links */}
          <nav aria-label="Global" className="hidden md:flex">
            <ul className="flex items-center space-x-8 text-sm">
              {/* Admin Dashboard link */}
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive ? "text-blue-900 font-semibold" : "text-gray-900"
                  }
                >
                  Admin Dashboard
                </NavLink>
              </li>
              {/* Manage Books link */}
              <li>
                <NavLink
                  to="/admin/manage-books"
                  className={({ isActive }) =>
                    isActive ? "text-blue-900 font-semibold" : "text-gray-900"
                  }
                >
                  Manage Books
                </NavLink>
              </li>
              {/* Manage Orders link */}
              <li>
                <NavLink
                  to="/admin/manage-orders"
                  className={({ isActive }) =>
                    isActive ? "text-blue-900 font-semibold" : "text-gray-900"
                  }
                >
                  Manage Orders
                </NavLink>
              </li>
              {/* Settings link */}
              <li>
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    isActive ? "text-blue-900 font-semibold" : "text-gray-900"
                  }
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Cart, Notification, Profile section */}
          <div className="flex items-center gap-6">
            <NavLink to="/admin/cart" className="text-gray-900">
              <img src={CartIcon} alt="Cart" className="h-6 w-6" />
            </NavLink>
            <NavLink to="/admin/notifications" className="flex items-center">
              <img src={NotificationIcon} alt="Notifications" className="h-6 w-6" />
            </NavLink>

            {/* Admin Profile & Logout */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <NavLink to="/admin/profile" className="flex items-center text-gray-900">
                  {/* Display admin profile image */}
                  <img
                    src={profilePic}
                    alt="Admin Profile"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <span>{user?.name}</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/admin/signin"
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/admin/signup"
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 hover:bg-[#102249] hover:text-white"
                >
                  Sign up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarAdmin;
