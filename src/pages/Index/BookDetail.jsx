import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import A from '../../Components/Index/Ramdom';
import { request } from '../../utils/request';
import { config } from '../../utils/config';
import { profileStore } from '../../store/Pfile_store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [addingToCart, setAddingToCart] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await request(`books/${id}`, 'get');
        if (!response?.book) {
          throw new Error('Book not found');
        }
        setBook(response.book);
        // Check stock status when book data is loaded
        if (response.book.stock <= 0) {
          setOutOfStock(true);
          setQuantity(0); // Set quantity to 0 if out of stock
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleQuantityChange = (change) => {
    if (outOfStock) return; // Don't allow quantity changes if out of stock
    
    const newQuantity = Math.max(1, quantity + change);
    // Ensure we don't exceed available stock
    if (book && newQuantity > book.stock) {
      toast.warning(`Only ${book.stock} items available`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddToCart = async () => {
    if (outOfStock) {
      toast.error("This book is currently out of stock");
      return;
    }

    const token = profileStore.getState().access_token;

    if (!token) {
      toast.error("You must be logged in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);

      const response = await fetch(`${config.base_url_api}cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: book.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Book added to cart successfully!");
      } else {
        toast.error(data.message || "Failed to add to cart. Please try again.");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 mt-10 flex justify-center">
        <p>Book not found</p>
      </div>
    );
  }

  const totalPrice = quantity * parseFloat(book.price);

  return (
    <>
      <div className="p-4 md:p-6 mt-6 lg:ml-40 lg:mr-40 md:mt-10 flex flex-col md:flex-row gap-8">
        {/* Book Info */}
        <div className="flex flex-col w-full md:w-[500px]">
          <div className="text-gray-600 mb-2">
            <Link to="/books" className="hover:underline">books</Link> &gt;{' '}
            <Link
              to={`/categories/${book.category?.name?.toLowerCase() || 'unknown'}`}
              className="hover:underline"
            >
              {book.category?.name || 'Unknown'}
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">{book.name}</h1>
          

          {/* Tabs */}
          <div className="flex mb-4 overflow-x-auto">
            {['details', 'shipping', 'returns','stock'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`mr-4 cursor-pointer whitespace-nowrap ${activeTab === tab ? 'font-bold border-b-2 border-black' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="text-gray-700">
            {activeTab === 'details' && <p>{book.description || 'No description available'}</p>}
            {activeTab === 'shipping' && (
              <p>
                Shipping information goes here. This can include details about shipping methods,
                costs, and estimated delivery times.
              </p>
            )}
            {activeTab === 'returns' && (
              <p>
                Return policy information goes here. This can include details on how to return
                items, timeframes, and conditions for returns.
              </p>
            )}
           {activeTab === 'stock' && (
  <div className="flex items-center justify-between mb-4">
    {book.stock > 0 ? (
      <span className="text-green-600">Only {parseFloat(book.stock)} left !</span>
    ) : (
      <span className="text-sm text-red-600">Out of Stock</span>
    )}
  </div>
)}

          </div>
        </div>

        {/* Book Cover */}
        <div className="flex justify-center lg:mr-14">
          <img
            src={book.cover_image.startsWith('http') ? book.cover_image : `${config.book_image_path}${book.cover_image}`}
            alt={`${book.name} book cover`}
            className="w-40 h-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
            }}
          />
        </div>

        {/* Cart Interaction */}
        <div className="flex flex-col w-full md:w-72">
          {!outOfStock && (
            <div className="flex items-center mb-4">
              <span className="font-semibold mr-2">Quantity:</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="border px-2 py-1 disabled:opacity-50"
              >
                -
              </button>
              <span className="mx-3">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= book.stock}
                className="border px-2 py-1 disabled:opacity-50"
              >
                +
              </button>
            </div>
          )}

          {!outOfStock && (
            <span className="font-semibold mb-4">Total: ${totalPrice.toFixed(2)}</span>
          )}

          {outOfStock ? (
            <button
              className="bg-gray-400  text-white px-4 py-2 w-full mb-3 cursor-not-allowed"
              disabled
            >
              Out of Stock
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                className="bg-[#102249] text-white px-4 py-2 hover:bg-[#102259] transition w-full mb-3"
                type="button"
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={async () => {
                  await handleAddToCart();
                  navigate("/checkout");
                }}
                className="border border-black text-black px-4 py-2 hover:bg-[#102249] hover:text-white transition w-full"
                type="button"
                disabled={addingToCart}
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>

      {/* Additional Component */}
      <A />
    </>
  );
};

export default BookDetail;