import React, { useState, useEffect } from 'react';
import { request } from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiDollarSign, 
  FiPackage, 
  FiUser, 
  FiCalendar, 
  FiCreditCard, 
  FiMessageSquare,
  FiEdit,
  FiCheck,
  FiX,
  FiImage,
  FiFilter,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';
import { config } from '../../utils/config';

// Constants for status and payment badges
const STATUS_CLASSES = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
};

const PAYMENT_CLASSES = {
  paid: 'bg-blue-100 text-blue-800',
  unpaid: 'bg-orange-100 text-orange-800',
  refunded: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800',
};

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'canceled'];
const VALID_PAYMENT_STATUSES = ['paid', 'unpaid', 'refunded', 'failed'];
const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

const SellerSalesDashboard = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    fromDate: '',
    toDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await request('seller/sales', 'get');
        
        if (!response || !Array.isArray(response.sales)) {
          throw new Error('Invalid response format from server');
        }
        
        setSales(response.sales);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setError(error.message);
        toast.error(`Failed to fetch sales: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSales();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => STATUS_CLASSES[status] || 'bg-gray-100 text-gray-800';
  const getPaymentBadge = (status) => PAYMENT_CLASSES[status] || 'bg-gray-100 text-gray-800';

  const startEditing = (orderId, currentStatus) => {
    setEditingStatus(orderId);
    setNewStatus(currentStatus);
  };

  const cancelEditing = () => {
    setEditingStatus(null);
    setNewStatus('');
  };

  const updateOrderStatus = async (orderId) => {
    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      toast.error('Please select a valid status');
      return;
    }

    try {
      const response = await request(`orders/${orderId}/status`, 'put', {
        order_status: newStatus,
      });

      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale.order_id === orderId ? { ...sale, order_status: newStatus } : sale
        )
      );

      toast.success('Order status updated successfully');
      setEditingStatus(null);
      setNewStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(`Failed to update status: ${error.response?.data?.message || error.message}`);
    }
  };

  const getCoverImageUrl = (coverPath) => {
    if (!coverPath) return null;
    if (coverPath.startsWith('http')) return coverPath;
    return `${config.book_image_path}${coverPath}`;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      paymentStatus: 'all',
      dateRange: 'all',
      fromDate: '',
      toDate: ''
    });
  };

  const isDateInRange = (dateString, range) => {
    const date = new Date(dateString);
    const now = new Date();
    
    switch(range) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return date >= weekStart;
      case 'month':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'year':
        return date.getFullYear() === now.getFullYear();
      case 'custom':
        if (!filters.fromDate || !filters.toDate) return true;
        const fromDate = new Date(filters.fromDate);
        const toDate = new Date(filters.toDate);
        return date >= fromDate && date <= toDate;
      default:
        return true;
    }
  };

  const filteredSales = sales.filter((sale) => {
    // Search filter
    const matchesSearch = 
      !filters.search ||
      sale.order_id.toString().includes(filters.search) ||
      (sale.buyer_name && sale.buyer_name.toLowerCase().includes(filters.search.toLowerCase())) ||
      (sale.buyer_email && sale.buyer_email.toLowerCase().includes(filters.search.toLowerCase())) ||
      (sale.books && sale.books.some(
        book => book.name && book.name.toLowerCase().includes(filters.search.toLowerCase()))
      );

    // Status filter
    const matchesStatus = 
      filters.status === 'all' || 
      sale.order_status === filters.status;

    // Payment status filter
    const matchesPaymentStatus = 
      filters.paymentStatus === 'all' || 
      sale.payment_status === filters.paymentStatus;

    // Date range filter
    const matchesDateRange = isDateInRange(sale.order_date, filters.dateRange);

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="sr-only">Loading...</span>
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
            aria-label="Retry loading"
            title="Retry"
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
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
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sales Dashboard</h2>
        <p className="text-gray-500 mt-1">
          {filteredSales.length} {filteredSales.length === 1 ? 'order' : 'orders'} found
        </p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <FiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search orders..."
              value={filters.search}
              onChange={handleFilterChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
            
            <button
              onClick={resetFilters}
              className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiRefreshCw />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                {VALID_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Payments</option>
                {VALID_PAYMENT_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {DATE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              {filters.dateRange === 'custom' && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      name="toDate"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredSales.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <FiPackage className="text-indigo-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.dateRange !== 'all' || filters.search
              ? "No orders match your current filters."
              : "You haven't made any sales yet."}
          </p>
          {(filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.dateRange !== 'all' || filters.search) && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSales.map((sale) => (
            <div
              key={sale.order_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center">
                    <FiPackage className="text-indigo-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Order #{sale.order_id}</h3>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <FiCalendar className="mr-1.5" />
                    <span>{formatDate(sale.order_date)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {editingStatus === sale.order_id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="border rounded-md px-3 py-1 text-sm"
                        aria-label="Update order status"
                      >
                        {VALID_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => updateOrderStatus(sale.order_id)}
                        className="text-green-600 hover:text-green-800"
                        aria-label="Confirm status update"
                        title="Confirm"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Cancel status update"
                        title="Cancel"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(sale.order_status)}`}
                      >
                        {sale.order_status || 'Unknown'}
                      </span>
                      <button
                        onClick={() => startEditing(sale.order_id, sale.order_status)}
                        className="text-gray-500 hover:text-indigo-600"
                        aria-label="Edit order status"
                        title="Edit status"
                      >
                        <FiEdit size={14} />
                      </button>
                    </>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(sale.payment_status)}`}
                  >
                    {sale.payment_status || 'Unknown'}
                  </span>
                  <span className="bg-purple-50 px-3 py-1 rounded-full text-xs font-medium text-purple-600">
                    ${parseFloat(sale.total_earned || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer and Payment Info */}
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiUser className="mr-2" /> Customer
                  </h4>
                  <p className="font-medium">{sale.buyer_name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{sale.buyer_email || 'N/A'}</p>
                  <div className="text-sm font-medium space-y-1">
                    <p className="text-sm text-gray-500">Country: {sale.payments?.[0]?.country || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Street Address: {sale.payments?.[0]?.street_address || 'N/A'}</p>
                    <p className="text-sm text-gray-500"> Town/City: {sale.payments?.[0]?.town_city || 'N/A'}</p>
                    <p className="text-sm text-gray-500">State/County: {sale.payments?.[0]?.state_county || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Phone: {sale.payments?.[0]?.phone || 'N/A'}</p>
                  </div>

                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiCreditCard className="mr-2" /> Payment
                  </h4>
                  <p className="text-sm text-black font-medium capitalize"> {sale.payments?.[0]?.payment_method || 'N/A'}</p>
                  <p className="text-sm text-gray-500 capitalize">{sale.payment_status || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiMessageSquare className="mr-2" /> Order Notes
                  </h4>
                  <p className="text-sm font-medium">
                    {sale.order_notes || (sale.payments?.[0]?.order_notes || 'No notes provided')}
                  </p>
                </div>
              </div>

              {/* Books Sold */}
              <div className="px-6 pb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Books Sold</h4>
                <div className="space-y-3">
                  {(sale.books || []).map((book, index) => {
                    const coverUrl = getCoverImageUrl(book.cover_image);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="h-full w-full overflow-hidden flex items-center justify-center mr-3">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={book.name || 'Book cover'}
                                className="w-16 h-20 rounded-sm object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '';
                                  e.target.parentElement.classList.add('bg-gray-200');
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <FiImage className="text-gray-400 text-xl" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{book.name || 'Unknown Book'}</p>
                            <p className="text-sm text-gray-500">Qty: {book.quantity || 1}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-800">
                          ${(parseFloat(book.price || 0) * (book.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerSalesDashboard;