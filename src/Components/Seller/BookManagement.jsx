import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { request } from '../../utils/request';
import { config } from '../../utils/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { profileStore } from "../../store/Pfile_store";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { funSetEditingBook } = profileStore();

  const handleEdit = (book) => {
    // Store the book data in the profile store before navigating
    funSetEditingBook(book);
    navigate(`/seller/edit-book/${book.id}`);
  };

  // Base URL for API (adjust according to your config)
 

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await request('my-books', 'get');
        
        if (!response || !Array.isArray(response.books)) {
          throw new Error('Invalid response format from server');
        }
        
        setBooks(response.books);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error.message);
        toast.error(`Failed to fetch books: ${error.response?.data?.message || error.message}`);
        
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    try {
      await request(`books/${id}`, 'delete');
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error(`Failed to delete book: ${error.response?.data?.message || error.message}`);
      
      if (error.response?.status === 404) {
        setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      }
    }
  };

  // Function to get full image URL
  const getCoverImageUrl = (coverPath) => {
    if (!coverPath) return 'https://via.placeholder.com/50';
    if (coverPath.startsWith('http')) return coverPath;
    return `${config.book_image_path}${coverPath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="absolute top-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">My Books</h2>
        <NavLink 
          to="/seller/add-book" 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          + Add New Book
        </NavLink>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {books.length > 0 ? (
              books.map(book => (
                
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-16 w-12">
                      <img 
                        className="h-full w-full object-cover rounded"
                        src={getCoverImageUrl(book.cover_image)}
                        alt={book.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{book.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {book.category?.name || 'N/A'}
                    </div>
                  </td>
               
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${parseFloat(book.price || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {parseFloat(book.stock || 0)}
                    </div>
                  </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{book.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${book.status === 'approved' ? 'bg-green-100 text-green-800' : 
                         book.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                         'bg-gray-100 text-gray-800'}`}>
                        
                      {book.status || 'unknown'}
                    </span>
                      {book.status === 'disapproved' && book.reject_note && (
                      <div className="mt-1  text-xs text-gray-500">
                        Reason: {book.reject_note}
                      </div>
                    )}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    <button
      onClick={() => handleEdit(book)}
      className="text-indigo-600 hover:text-indigo-900 mr-4"
    >
      Edit
    </button>
    <button 
      onClick={() => handleDelete(book.id)}
      className="text-red-600 hover:text-red-900"
    >
      Delete
    </button>
  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No books found. Start by adding your first book.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookManagement;