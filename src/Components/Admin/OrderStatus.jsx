import React, { useState, useEffect, useRef } from 'react';
import { request } from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '../../utils/config';
import { 
  FiPackage, 
  FiUser, 
  FiCalendar, 
  FiCreditCard, 
  FiMessageSquare,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiPrinter,
  FiImage
} from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const AdminOrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    fromDate: null,
    toDate: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const dashboardRef = useRef();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await request('admin/orders', 'get');
        
        if (!response || !Array.isArray(response.orders)) {
          throw new Error('Invalid response format from server');
        }
        
        setOrders(response.orders.map(order => ({
          ...order,
          uniqueKey: order.order_id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })));
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        toast.error(`Failed to fetch orders: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => STATUS_CLASSES[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  const getPaymentBadge = (status) => PAYMENT_CLASSES[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';

  const getCoverImageUrl = (bookImage) => {
    if (!bookImage) return null;
    
    // Handle Cloudinary object format
    if (typeof bookImage === 'object' && bookImage.url) {
      return bookImage.url;
    }
    
    // Handle direct URL string
    if (typeof bookImage === 'string' && bookImage.startsWith('http')) {
      return bookImage;
    }
    
    // Handle relative path
    if (typeof bookImage === 'string') {
      return `${config.book_image_path}${bookImage}`;
    }
    
    return null;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      ...(name === 'dateRange' && value !== 'custom' && { fromDate: null, toDate: null })
    });
  };

  const handleDateChange = (date, field) => {
    setFilters({
      ...filters,
      [field]: date
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      paymentStatus: 'all',
      dateRange: 'all',
      fromDate: null,
      toDate: null
    });
  };

  const isDateInRange = (dateString, range) => {
    if (!dateString) return false;
    
    let date;
    try {
      date = new Date(dateString);
      if (isNaN(date.getTime())) return false;
    } catch (e) {
      return false;
    }

    const now = new Date();
    
    switch(range) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return date >= weekStart;
      case 'month':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'year':
        return date.getFullYear() === now.getFullYear();
      case 'custom':
        if (!filters.fromDate || !filters.toDate) return true;
        const fromDate = new Date(filters.fromDate);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        return date >= fromDate && date <= toDate;
      default:
        return true;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      !filters.search ||
      (order.order_id && order.order_id.toString().includes(filters.search)) ||
      (order.user?.name && order.user.name.toLowerCase().includes(filters.search.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(filters.search.toLowerCase())) ||
      (order.items && order.items.some(
        item => item.book_name && item.book_name.toLowerCase().includes(filters.search.toLowerCase()))
      );

    const matchesStatus = 
      filters.status === 'all' || 
      (order.order_status && order.order_status.toLowerCase() === filters.status.toLowerCase());

    const matchesPaymentStatus = 
      filters.paymentStatus === 'all' || 
      (order.payment_status && order.payment_status.toLowerCase() === filters.paymentStatus.toLowerCase());

    const matchesDateRange = isDateInRange(order.created_at, filters.dateRange);

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange;
  });

  const handlePrint = useReactToPrint({
    content: () => dashboardRef.current,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
        .print-break { page-break-after: always; }
      }
    `
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
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" ref={dashboardRef}>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Orders Dashboard</h2>
            <p className="text-gray-500 mt-1">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
            </p>
          </div>
          <div className="flex gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiPrinter /> Print
            </button>
          </div>
        </div>
      </div>

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
                    <DatePicker
                      selected={filters.fromDate}
                      onChange={(date) => handleDateChange(date, 'fromDate')}
                      selectsStart
                      startDate={filters.fromDate}
                      endDate={filters.toDate}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                      placeholderText="Start date"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <DatePicker
                      selected={filters.toDate}
                      onChange={(date) => handleDateChange(date, 'toDate')}
                      selectsEnd
                      startDate={filters.fromDate}
                      endDate={filters.toDate}
                      minDate={filters.fromDate}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                      placeholderText="End date"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <FiPackage className="text-indigo-500 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filters.status !== 'all' || filters.paymentStatus !== 'all' || filters.dateRange !== 'all' || filters.search
              ? "No orders match your current filters."
              : "No orders have been placed yet."}
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
          {filteredOrders.map((order) => (
            <div
              key={order.uniqueKey}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print-break"
            >
              <div className="px-6 py-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center">
                    <FiPackage className="text-indigo-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Order #{order.order_id}</h3>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <FiCalendar className="mr-1.5" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.order_status)}`}
                  >
                    {order.order_status || 'Unknown'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(order.payment_status)}`}
                  >
                    {order.payment_status || 'Unknown'}
                  </span>
                  <span className="bg-purple-50 px-3 py-1 rounded-full text-xs font-medium text-purple-600">
                    ${parseFloat(order.total_price || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiUser className="mr-2" /> Customer
                  </h4>
                  <p className="font-medium">{order.user?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiCreditCard className="mr-2" /> Payment
                  </h4>
                  <p className="text-sm text-black font-medium capitalize">{order.payment_status || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Total: ${parseFloat(order.total_price || 0).toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FiMessageSquare className="mr-2" /> Order Notes
                  </h4>
                  <p className="text-sm font-medium">
                    {order.order_notes || 'No notes provided'}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Items</h4>
                <div className="space-y-3">
                  {(order.items || []).map((item, index) => {
                    const coverUrl = getCoverImageUrl(item.book_image);
                    const fallbackColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
                    
                    return (
                      <div
                        key={`${order.uniqueKey}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div 
                            className="h-20 w-16 overflow-hidden flex items-center justify-center mr-3 rounded-sm"
                            style={{ backgroundColor: !coverUrl ? fallbackColor : 'transparent' }}
                          >
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={item.book_name || 'Book cover'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '';
                                  e.target.parentElement.style.backgroundColor = fallbackColor;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiImage className="text-white text-xl" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.book_name || 'Unknown Book'}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                            <p className="text-sm text-gray-500">Price: ${parseFloat(item.price || 0).toFixed(2)}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-800">
                          ${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}
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

export default AdminOrdersView;