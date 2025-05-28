import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropsCardComponents from "../../Components/Index/Card";
import { config } from "../../utils/config";
import { profileStore } from "../../store/Pfile_store";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Fitness = ({ showAll, setShowAll }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingBookId, setAddingBookId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.base_url_api}books`)
      .then((res) => res.json())
     .then((data) => {
  const approvedBooks = data.books.filter(
    (book) => book.status === "approved"
  );
  setBooks(approvedBooks);
  setLoading(false);
})

      .catch((err) => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  const displayedBooks = showAll
    ? books
    : shuffleArray(books).slice(0, 12); // Random 4 books

  const handleCardClick = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  const handleAddToCart = async (e, bookId) => {
    e.stopPropagation();

    const token = profileStore.getState().access_token;
    if (!token) {
     toast.error("You must be logged in to add items to your cart.");
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
         toast.success("Book added to cart!");
      } else {
        toast.error(data.message || "Failed to add to cart.");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Something went wrong.");
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
     <div className="flex flex-col items-center justify-center text-center mb-4">
  <div className="mb-2">
    <h1 className="text-sm sm:text-base font-bold">books</h1>
    <h1 className="text-xl sm:text-3xl  text-[#102249] font-bold">Books</h1>
    <p className="text-sm text-gray-500 sm:text-base">
      Explore our collection of anime-related books.
    </p>
  </div>
</div>


      {books.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No anime books available at the moment.
        </div>
      ) : (
        <div className="relative">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:ml-28 lg:mr-28 sm:ml-4 sm:mr-4 md:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {displayedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => handleCardClick(book.id)}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 w-[120px] sm:w-full"
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
                  isMobile={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fitness;
