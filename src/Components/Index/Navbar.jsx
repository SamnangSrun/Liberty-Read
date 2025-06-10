import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaSpinner, FaHistory } from 'react-icons/fa';

import Logo from "../../Img/Logo.png";
import CartIcon from "../../Img/Index/Navbar/card.png";
import signout from "../../Img/sign-out.png";
import seller from "../../Img/seller.png";
import edit from "../../Img/edit.png";
import dasbord from "../../Img/dasbord.png";
import notification from "../../Img/notification.png";

import { profileStore } from "../../store/Pfile_store";
import { config } from "../../utils/config";
import { request } from "../../utils/request";

export function NavbarComponents() {
  const navigate = useNavigate();
  const { access_token, user, funLogout } = profileStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItem, setRemovingItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const isLoggedIn = !!access_token;
  const defaultProfilePic = "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg";
  const [profilePic, setProfilePic] = useState(defaultProfilePic);

  const menuList = [
    { path: "/home", title: "Home" },
    { path: "/books", title: "Books" },
    { path: "/about", title: "About Us" },
    { path: "/contact", title: "Contact" },
  ];

  const categoriesList = [
    { path: "/children", title: "Children's Books" },
    { path: "/non-fiction", title: "Non-Fiction" },
    { path: "/fiction", title: "Fiction" },
    { path: "/health-lifestyle", title: "Health & Lifestyle" },
  ];

  useEffect(() => {
    if (user?.profile_image) {
      setProfilePic(`${config.profile_image_path}${user.profile_image}?${new Date().getTime()}`);
    } else {
      setProfilePic(defaultProfilePic);
    }
  }, [user?.profile_image]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn]);

  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await request('cart', 'get');
      
      let items = [];
      if (Array.isArray(response)) {
        items = response;
      } else if (response?.data && Array.isArray(response.data)) {
        items = response.data;
      } else if (response?.items) {
        items = response.items;
      } else {
        throw new Error("Invalid cart data format");
      }
      
      setCartItems(items);
      setCartItemsCount(items.reduce((total, item) => total + (item.quantity || 0), 0));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      console.error('Failed to load cart items');
    } finally {
      setCartLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, change) => {
    try {
      const currentItem = cartItems.find(item => item.id === itemId);
      if (!currentItem) return;
      
      const newQuantity = currentItem.quantity + change;
      
      // Validate new quantity
      if (newQuantity < 1) return;
      
      // Check stock availability
      if (newQuantity > currentItem.book.stock) {
        toast.error(`Only ${currentItem.book.stock} items available in stock`);
        return;
      }

      setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
      
      // Optimistic update
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      setCartItemsCount(prev => prev + change);

      await request(`cart/item/${itemId}`, 'put', { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(`Failed to update quantity: ${error.message}`);
      
      // Revert on error
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: currentItem.quantity }
            : item
        )
      );
      setCartItemsCount(prev => prev - change);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setRemovingItem(itemId);
      const itemToRemove = cartItems.find(item => item.id === itemId);
      if (!itemToRemove) return;
      
      // Optimistic update
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setCartItemsCount(prev => prev - itemToRemove.quantity);
      
      await request(`cart/item/${itemId}`, 'delete');
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(`Failed to remove item: ${error.message}`);
      
      // Revert on error
      if (itemToRemove) {
        setCartItems(prevItems => [...prevItems, itemToRemove]);
        setCartItemsCount(prev => prev + itemToRemove.quantity);
      }
    } finally {
      setRemovingItem(null);
    }
  };

  const totalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const handleProceedToCheckout = async (e) => {
    e.preventDefault();
    if (cartLoading || cartItems.length === 0) return;

    // Check stock availability before proceeding to checkout
    const outOfStockItems = cartItems.filter(item => item.quantity > item.book.stock);
    if (outOfStockItems.length > 0) {
      toast.error(`Some items in your cart exceed available stock`);
      return;
    }

    try {
      setCartLoading(true);
      const response = await request('orders', 'post', {
        cartItems: cartItems.map(item => ({
          book_id: item.book.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const orderId = response?.order?.id || response?.id;
      if (!orderId) {
        throw new Error("Invalid order response");
      }

      setCartDropdownOpen(false);
      navigate('/checkout', { state: { orderId, cartItems } });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to proceed to checkout: ${error.message || 'Unknown error'}`);
    } finally {
      setCartLoading(false);
    }
  };

  const viewOrderHistory = () => {
    navigate('/order-history');
    setCartDropdownOpen(false);
  };

  const handleLogout = () => {
    funLogout();
    toast.success("You have successfully logged out!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate("/");
  };

  const handleCategoryClick = (title) => {
    setSelectedCategory(title);
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
    setCartDropdownOpen(false);
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setDropdownOpen(false);
    setCartDropdownOpen(false);
  };

  const toggleCartDropdown = () => {
    setCartDropdownOpen(!cartDropdownOpen);
    setDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setDropdownOpen(false);
      setProfileDropdownOpen(false);
      setCartDropdownOpen(false);
    }
  };

  const toggleMobileCategories = () => {
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
        setProfileDropdownOpen(false);
        setCartDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <NavLink to="/" className="block text-teal-600">
                <img src={Logo} alt="Logo" className="w-40 hover:opacity-90 transition-opacity" />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav aria-label="Global" className="hidden md:flex">
              <ul className="flex items-center space-x-8 text-sm">
                {menuList.map((menu, index) => (
                  <li key={index}>
                    <NavLink
                      to={menu.path}
                      className={({ isActive }) =>
                        `transition-colors hover:text-[#102249] ${isActive ? "text-[#102249] font-medium" : "text-gray-700"}`
                      }
                    >
                      {menu.title}
                    </NavLink>
                  </li>
                ))}
                <li className="relative dropdown-container">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center text-gray-700 hover:text-[#102249] focus:outline-none transition-colors"
                  >
                    {selectedCategory}
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`ml-2 h-3 w-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-100">
                      {categoriesList.map((category, index) => (
                        <li key={index}>
                          <NavLink
                            to={category.path}
                            className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-[#102249] transition-colors"
                            onClick={() => handleCategoryClick(category.title)}
                          >
                            {category.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-6">
              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-700 hover:text-[#102249]"
                aria-label="Toggle menu"
              >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
              </button>

              {/* Cart Dropdown */}
              <div className="relative dropdown-container">
                <button 
                  onClick={toggleCartDropdown}
                  className="relative p-1"
                >
                  <img src={CartIcon} alt="Cart" className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#102249] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {cartDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 mt-2 w-80 bg-white shadow-xl right-0 sm:right-0 sm:left-auto rounded-lg z-50 border border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Your Cart ({cartItemsCount})</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={viewOrderHistory}
                          className="flex items-center text-[#102249] hover:underline text-sm"
                        >
                          <FaHistory className="mr-1" />
                          History
                        </button>
                        <button 
                          onClick={() => setCartDropdownOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </div>

                    {cartLoading ? (
                      <div className="p-4 flex justify-center">
                        <FaSpinner className="animate-spin text-[#102249]" size={24} />
                      </div>
                    ) : cartItems.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">Your cart is empty</p>
                        <NavLink
                          to="/books"
                          className="mt-2 inline-block text-[#102249] hover:underline font-medium"
                          onClick={() => setCartDropdownOpen(false)}
                        >
                          Continue Shopping
                        </NavLink>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-96 overflow-y-auto p-2">
                          {cartItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="flex gap-3 p-3 border rounded-lg mb-2 hover:shadow transition-all duration-200"
                            >
                              <div className="flex-shrink-0">
                                <img 
                                  src={`${config.profile_image_path}${item.book.cover_image}`} 
                                  alt={item.book.name} 
                                  className="w-16 h-20 rounded-sm object-cover" 
                                  onError={(e) => { e.target.src = defaultProfilePic; }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{item.book.name}</h3>
                                <p className="text-gray-600 text-xs truncate">{item.book.author}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Stock: {item.book.stock}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="font-bold text-[#102249] text-sm">
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <button 
                                      onClick={() => handleQuantityChange(item.id, -1)}
                                      disabled={updatingItems[item.id] || item.quantity <= 1}
                                      className={`w-6 h-6 flex items-center justify-center border rounded-full ${
                                        updatingItems[item.id] || item.quantity <= 1 
                                          ? 'opacity-50 cursor-not-allowed' 
                                          : 'hover:bg-gray-100'
                                      }`}
                                    >
                                      {updatingItems[item.id] ? (
                                        <FaSpinner className="animate-spin text-xs" />
                                      ) : (
                                        '-'
                                      )}
                                    </button>
                                    
                                    <span className={`w-6 text-center text-sm ${
                                      updatingItems[item.id] ? 'opacity-70' : ''
                                    }`}>
                                      {item.quantity}
                                    </span>
                                    
                                    <button 
                                      onClick={() => handleQuantityChange(item.id, 1)}
                                      disabled={updatingItems[item.id] || item.quantity >= item.book.stock}
                                      className={`w-6 h-6 flex items-center justify-center border rounded-full ${
                                        updatingItems[item.id] || item.quantity >= item.book.stock
                                          ? 'opacity-50 cursor-not-allowed' 
                                          : 'hover:bg-gray-100'
                                      }`}
                                      title={item.quantity >= item.book.stock ? 'Maximum quantity reached' : ''}
                                    >
                                      {updatingItems[item.id] ? (
                                        <FaSpinner className="animate-spin text-xs" />
                                      ) : (
                                        '+'
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={removingItem === item.id}
                                className="text-red-500 hover:text-red-700 p-1 self-start"
                                aria-label="Remove item"
                              >
                                {removingItem === item.id ? (
                                  <FaSpinner className="animate-spin" size={14} />
                                ) : (
                                  <FaTrash size={14} />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 border-t border-gray-100">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${totalPrice()}</span>
                          </div>
                          <div className="flex justify-between mb-4">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-green-600">Free</span>
                          </div>
                          <button
                            onClick={handleProceedToCheckout}
                            disabled={cartLoading || cartItems.length === 0}
                            className={`w-full bg-[#102249] text-white text-center py-2 rounded-lg transition-colors ${
                              cartLoading || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#102259]'
                            }`}
                          >
                            {cartLoading ? (
                              <FaSpinner className="animate-spin mx-auto" size={20} />
                            ) : (
                              'Proceed to Checkout'
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <NavLink to="/notifications" className="relative">
                <img src={notification} alt="Notifications" className="h-6 w-6" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationsCount}
                  </span>
                )}
              </NavLink>

              {isLoggedIn ? (
                <div className="relative dropdown-container">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center text-gray-700 hover:text-[#102249] transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-gray-200 hover:border-[#102249] transition-colors"
                        onError={(e) => { e.target.src = defaultProfilePic; }}
                      />
                    </div>
                    <span className="hidden md:inline">{user?.name}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg z-50 border border-gray-100">
                      <div className="flex items-center p-4 border-b border-gray-100">
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                          onError={(e) => { e.target.src = defaultProfilePic; }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                          <p className="text-xs text-gray-500 capitalize mt-1">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full">
                              {user?.role}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <NavLink 
                          to="/edit-profile" 
                          className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <img src={edit} alt="Edit" className="mr-3 w-4 h-4" />
                          Edit Profile
                        </NavLink>
                        
                        <NavLink 
                          to="/seller-step" 
                          className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <img src={seller} alt="Seller" className="mr-3 w-4 h-4" />
                          Become Seller
                        </NavLink>
                        
                        {user?.role?.toLowerCase() === 'admin' && (
                          <NavLink 
                            to="/admin" 
                            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <img src={dasbord} alt="Admin" className="mr-3 w-4 h-4" />
                            Admin Dashboard
                          </NavLink>
                        )}

                        {user?.role?.toLowerCase() === 'seller' && (
                          <NavLink 
                            to="/seller" 
                            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <img src={dasbord} alt="Seller" className="mr-3 w-4 h-4" />
                            Seller Dashboard
                          </NavLink>
                        )}
                      </div>
                      
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <img src={signout} alt="Logout" className="mr-3 w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <NavLink
                    to="/signin"
                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[#102249] hover:bg-[#0a1a3a] transition-colors shadow-sm"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-200">
              <div className="px-4 py-3 space-y-2">
                {menuList.map((menu, index) => (
                  <NavLink
                    key={index}
                    to={menu.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive ? "bg-gray-100 text-[#102249]" : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {menu.title}
                  </NavLink>
                ))}
                
                <div>
                  <button
                    onClick={toggleMobileCategories}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Categories
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`ml-2 h-3 w-3 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {mobileCategoriesOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      {categoriesList.map((category, index) => (
                        <NavLink
                          key={index}
                          to={category.path}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => handleCategoryClick(category.title)}
                        >
                          {category.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
                
                {!isLoggedIn && (
                  <div className="pt-2 space-y-2 border-t border-gray-200">
                    <NavLink
                      to="/signin"
                      className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-[#102249] hover:bg-[#0a1a3a] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default NavbarComponents;