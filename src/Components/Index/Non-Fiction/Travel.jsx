import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropsCardComponents from "../Card";
import { config } from "../../../utils/config";
import { profileStore } from "../../../store/Pfile_store";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FairyTales = ({ showAll, setShowAll }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingBookId, setAddingBookId] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.base_url_api}books`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch books");
        }
      const animeBooks = data.books.filter(
        (book) =>
          ["Travel", "Culture"].includes(book.category?.name?.toLowerCase()) &&
          book.status === "approved"
      );

        setBooks(animeBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
        toast.error("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const displayedBooks = showAll ? books : books.slice(0, 8);

  const handleCardClick = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  const handleAddToCart = async (e, bookId) => {
    e.stopPropagation();

    const token = profileStore.getState().access_token;
    if (!token) {
      toast.info("You must be logged in to add items to your cart.", {
        autoClose: 3000,
        closeOnClick: true,
      });
      navigate("/login");
      return;
    }

    try {
      setAddingBookId(bookId);
      const response = await fetch(`${config.base_url_api}cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: bookId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecentlyAddedId(bookId);
        setTimeout(() => setRecentlyAddedId(null), 2000); // Reset after 2 seconds
        toast.success("Book added to cart!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
        });
      } else {
        throw new Error(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setAddingBookId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="mb-2 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold"> Travel & Culture</h1>
          <p className="text-sm sm:text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
        </div>
        {books.length > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="border border-black py-1 px-3 sm:py-2 sm:px-4 rounded hover:bg-gray-500 hover:text-white transition text-sm sm:text-base"
          >
            {showAll ? "Show Less" : `View All (${books.length})`}
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No anime books available at the moment.
        </div>
      ) : (
        <div className="relative">
          <div className="">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-2  sm:ml-4 sm:mr-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-5">
              {displayedBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleCardClick(book.id)}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                >
                  <PropsCardComponents
                    id={book.id}
                    imageSrc={`${config.book_image_path}${book.cover_image}`}
                    title={book.name}
                    director={book.author}
                    genre={book.category?.name || "Unknown"}
                    price={book.price}
                    onAddToCart={(e) => handleAddToCart(e, book.id)}
                    isAdding={addingBookId === book.id}
                    isAdded={recentlyAddedId === book.id}
                    isMobile={window.innerWidth < 640}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FairyTales;