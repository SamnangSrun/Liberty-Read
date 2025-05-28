import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { profileStore } from "../../store/Pfile_store";
import { config } from "../../utils/config";
import { request } from "../../utils/request";

export function NavbarComponents() {
  const navigate = useNavigate();
  const { access_token, user, funLogout, funSetUser } = profileStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Helper: normalize role to lowercase string safely
  const getRoleString = (role) => {
    if (!role) return "";
    if (typeof role === "string") return role.toLowerCase();
    if (typeof role === "object" && role.name) return role.name.toLowerCase();
    return "";
  };

  const currentRole = getRoleString(user?.role);
  const isAdmin = currentRole === "admin";
  const isSeller = currentRole === "seller";
  const isCustomer = !isAdmin && !isSeller;

  // 1. Fetch user data once on component mount (page reload)
  useEffect(() => {
    if (!access_token) return;

    async function fetchUserOnLoad() {
      try {
        const res = await request("user/me", "get");
        if (res?.user) {
          funSetUser(res.user);
        }
      } catch (error) {
        console.error("Failed to fetch user data on page load:", error);
      }
    }

    fetchUserOnLoad();
  }, [access_token, funSetUser]);

  // 2. Polling function to check for role updates
  useEffect(() => {
    if (!access_token) return;

    const checkRoleUpdates = async () => {
      try {
        console.log("[Navbar] Polling for user/me to check role updates...");
        const res = await request("user/me", "get");
        if (!res?.user) {
          console.warn("[Navbar] No user data returned from user/me");
          return;
        }
        const backendRole = getRoleString(res.user.role);

        console.log("[Navbar] Backend role:", backendRole, "Current role:", currentRole);

        if (backendRole && backendRole !== currentRole) {
          console.log("[Navbar] Role changed, updating user store...");
          funSetUser(res.user);
          setAlert({ message: `Role updated to ${backendRole}`, type: "success" });
        }
      } catch (error) {
        console.error("[Navbar] Error polling user/me:", error);
      }
    };

    const interval = setInterval(checkRoleUpdates, 10000);
    return () => clearInterval(interval);
  }, [access_token, currentRole, funSetUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  const handleBecomeSeller = async () => {
    setIsLoading(true);
    try {
      const res = await request("seller/request", "post");
      if (res.success) {
        showAlert("Seller request submitted. Waiting for admin approval.");
      } else {
        showAlert(res.message || "Request failed", "error");
      }
    } catch (error) {
      showAlert("Failed to submit request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    funLogout();
    showAlert("Logged out successfully");
    navigate("/");
  };

  // Manual refresh button for testing
  const manualRefreshUser = async () => {
    try {
      const res = await request("user/me", "get");
      if (res?.user) {
        funSetUser(res.user);
        showAlert("User data refreshed");
      } else {
        showAlert("No user data returned", "error");
      }
    } catch (error) {
      showAlert("Failed to refresh user data", "error");
    }
  };

  const defaultProfilePic =
    "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
  const profilePic = user?.profile_image
    ? `${config.profile_image_path}${user.profile_image}?t=${new Date().getTime()}`
    : defaultProfilePic;

  return (
    <>
      {alert.message && (
        <div
          className={`w-full text-white px-4 py-2 text-center text-sm font-medium ${
            alert.type === "success" ? "bg-[#102249]" : "bg-red-600"
          }`}
        >
          {alert.message}
        </div>
      )}

      <header className="bg-white shadow">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Add your logo or main navigation here */}

            <div className="flex items-center gap-6">
              {access_token ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center text-gray-900"
                  >
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-2"
                      onError={(e) => {
                        e.target.src = defaultProfilePic;
                      }}
                    />
                    <span>{user?.name}</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                      {currentRole}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-sm" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md z-50">
                      <div className="flex items-center p-4">
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-10 h-10 rounded-3xl mr-2"
                          onError={(e) => {
                            e.target.src = defaultProfilePic;
                          }}
                        />
                        <div>
                          <p className="font-semibold">{user?.name}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {currentRole}
                            {isSeller && " (Verified Seller)"}
                            {isAdmin && " (Administrator)"}
                          </p>
                        </div>
                      </div>
                      <hr />

                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                      >
                        My Profile
                      </NavLink>

                      {isCustomer && (
                        <button
                          onClick={handleBecomeSeller}
                          disabled={isLoading}
                          className={`block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isLoading ? "Processing..." : "Become a Seller"}
                        </button>
                      )}

                      {isAdmin && (
                        <NavLink
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </NavLink>
                      )}

                      {isSeller && (
                        <NavLink
                          to="/seller/dashboard"
                          className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                        >
                          Seller Dashboard
                        </NavLink>
                      )}

                      <hr />

                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>

                      <hr />

                      {/* Manual refresh button for testing */}
                      <button
                        onClick={manualRefreshUser}
                        className="block w-full px-4 py-2 text-left text-gray-700 bg-gray-100 hover:bg-gray-200 rounded mt-2"
                      >
                        Refresh User Data (Test)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-4">
                  <NavLink
                    to="/signin"
                    className="px-4 py-2 text-gray-900 hover:text-[#102249]"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2 bg-[#102249] text-white rounded hover:bg-blue-800"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
