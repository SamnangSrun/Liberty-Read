import React, { useState, useEffect, useMemo } from 'react';
import { request } from '../../utils/request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '../../utils/config';

const RequestSellerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockSort, setStockSort] = useState('none'); // 'none', 'asc', 'desc'
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await request('books/requested', 'get');
        const approvedBooks = (response.data || []).filter(book => book.status === 'approved');
        setSellerRequests(approvedBooks);
      } catch (error) {
        toast.error('Failed to fetch requests: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    const pollInterval = setInterval(fetchRequests, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const filteredRequests = useMemo(() => {
    let filtered = [...sellerRequests];
    
    // Apply search filter
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter((req) =>
      (req.name ?? '').toLowerCase().includes(term) ||
      (req.author ?? '').toLowerCase().includes(term) ||
      (req.category?.name ?? '').toLowerCase().includes(term)
    );

    // Apply stock sorting
    if (stockSort === 'asc') {
      filtered.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    } else if (stockSort === 'desc') {
      filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    }

    return filtered;
  }, [sellerRequests, searchTerm, stockSort]);

  // Pagination logic
  useEffect(() => {
    const maxPage = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
    if (currentPage > maxPage) setCurrentPage(1);
  }, [filteredRequests, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleDeleteRequest = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    try {
      await request(`admin/book/${id}`, 'delete');
      setSellerRequests(prev => prev.filter(req => req.id !== id));
      toast.success('Book deleted successfully!');
    } catch (error) {
      toast.error(`Failed to delete book: ${error.response?.data?.message || error.message}`);
    }
  };

  const toggleStockSort = () => {
    setStockSort(prev => {
      if (prev === 'none') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'none';
    });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">Approved Books</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md p-2 w-full pl-10"
            />
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-green-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cover</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={toggleStockSort}
              >
                <div className="flex items-center">
                  Stock
                  {stockSort === 'asc' && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                  {stockSort === 'desc' && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((req) => (
                <tr key={req.id} className="bg-green-50 hover:bg-green-100 transition-colors">
                  <td className="px-6 py-4">
                    {req.cover_image ? (
                      <img
                        src={`${config.book_image_path}${req.cover_image}`}
                        alt={req.name}
                        className="h-12 w-9 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/36x48';
                        }}
                      />
                    ) : (
                      <div className="h-12 w-9 bg-green-200 rounded flex items-center justify-center">
                        <span className="text-green-800 text-xs">
                          {(req.name?.charAt(0) || 'B').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{req.name || 'Untitled'}</td>
                  <td className="px-6 py-4 text-gray-700">{req.author || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{req.category?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">${req.price || '0.00'}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      req.stock > 10 ? 'bg-green-100 text-green-800' : 
                      req.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {req.stock || '0'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                      title="Delete book"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No approved books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-green-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestSellerTable;