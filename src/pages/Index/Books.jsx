import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropsCardComponents from "../../Components/Index/Card";
import { config } from "../../utils/config";
import { profileStore } from "../../store/Pfile_store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import BannerBookComponents from "../../Components/Index/BannerBook";

const Fitness = ({ showAll, setShowAll }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingBookId, setAddingBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!profileStore.getState().access_token;

  useEffect(() => {
    fetch(`${config.base_url_api}books`)
      .then((res) => res.json())
      .then((data) => {
        const booksData = data.books || data || [];
        setBooks(booksData);
        setFilteredBooks(booksData);
        setLoading(false);

        // Fallback categories from books
        const uniqueCategories = [
          ...new Set(booksData.map((book) => book.category?.name).filter(Boolean)),
        ].map((name, index) => ({ id: index + 1, name }));

        if (!isAuthenticated) {
          setCategories(uniqueCategories);
          setLoadingCategories(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        toast.error("Failed to load books");
        setLoading(false);
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${config.base_url_api}categories`)
        .then((res) => res.json())
        .then((data) => {
          const categoryData = data.categories || data || [];
          setCategories(categoryData);
          setLoadingCategories(false);
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          toast.error("Failed to load categories");
          const uniqueCategories = [
            ...new Set(books.map((book) => book.category?.name).filter(Boolean)),
          ].map((name, index) => ({ id: index + 1, name }));
          setCategories(uniqueCategories);
          setSelectedCategory("Anime");
          setLoadingCategories(false);
        });
    }
  }, [isAuthenticated, books]);

  // ✅ Filter books based only on name + optional category
  useEffect(() => {
    let filtered = books.filter(
      (book) =>
        book.name.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
        (selectedCategory === "" || book.category?.name === selectedCategory)
    );
    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategory, books]);

  const displayedBooks = showAll ? filteredBooks : filteredBooks.slice(0, 8);

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

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in category:", selectedCategory || "All");
  };

  if (loading || loadingCategories) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <BannerBookComponents />
      <div className="container mx-auto p-4">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="flex flex-row sm:flex-row justify-between items-center gap-4 mb-6 max-w-3xl mx-auto mt-4">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by book name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <div className="w-full max-w-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-40 p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-[#102249]"
              aria-label="Select category"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No books found matching your criteria.
          </div>
        ) : (
          <div className="grid lg:ml-32 grid-cols-3 gap-2 lg:mr-32 sm:ml-4 sm:mr-8 md:ml-32 md:mr-32 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fitness;
