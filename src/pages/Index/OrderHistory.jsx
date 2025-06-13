import React, { useEffect, useState } from "react";
import { profileStore } from "../../store/Pfile_store";
import { config } from "../../utils/config";
import { FaBook, FaChevronDown, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const UserOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showClearOldModal, setShowClearOldModal] = useState(false);
  const fetchOrders = profileStore((state) => state.funFetchUserOrders);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [fetchOrders]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      cancelled: "bg-rose-100 text-rose-700 border-rose-200",
      processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const clearOldOrders = () => {
    // In a real app, you would call an API to archive/delete old orders
    // For now, we'll just filter them out from the UI
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 3); // 3 months ago
    
    setOrders(orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= cutoffDate;
    }));
    
    setShowClearOldModal(false);
    // You might want to show a toast notification here
  };

  // Filter orders based on search query and filters
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.order_items.some(
        (item) =>
          item.book?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.book?.author.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Status filter
    const matchesStatus =
      statusFilter === "all" || order.order_status.toLowerCase() === statusFilter;

    // Date filter
    const orderDate = new Date(order.created_at);
    const now = new Date();
    let matchesDate = true;
    
    if (dateFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      matchesDate = orderDate >= oneMonthAgo;
    } else if (dateFilter === "year") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      matchesDate = orderDate >= oneYearAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-4 border-indigo-500 rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <motion.div
            className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-indigo-50 mb-4"
            whileHover={{ scale: 1.1 }}
          >
            <FaBook className="h-12 w-12 text-indigo-500" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {orders.length === 0 ? "No Orders Found" : "No Matching Orders"}
          </h3>
          <p className="text-gray-500 mb-6">
            {orders.length === 0
              ? "Start shopping to see your order history here!"
              : "Try adjusting your filters to find what you're looking for."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setDateFilter("all");
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 mr-3"
          >
            Clear Filters
          </button>
          <button
            onClick={() => window.location.href = "/books"}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-600 transition-all duration-300"
          >
            Browse Books
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
          <p className="mt-2 text-sm text-gray-600">Track and explore your past purchases</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowClearOldModal(true)}
            className="flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <FaTrash className="mr-2" />
            Clear Old Orders
          </button>
        </div>
      </motion.div>

      {/* Filters Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="shipped">shipped</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">delivered</option>
            <option value="canceled">canceled</option>
          </select>
        </div>

        <div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
          >
            <option value="all">All Dates</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Order Header */}
              <div
                className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="p-2 bg-indigo-100 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaBook className="h-6 w-6 text-indigo-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Order {order.id}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center space-x-6">
                  <div>
                    <span className={`mt-1 px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                      order.order_status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.order_status.toLowerCase() === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.order_status.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.order_status.toLowerCase() === 'canceled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.order_status}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedOrder === order.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </div>
              </div>

              {/* Order Items - Collapsible */}
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="divide-y divide-gray-100"
                  >
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 flex flex-col sm:flex-row hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                          <div className="w-16 h-20 overflow-hidden rounded-md">
                            {item.book?.cover_image ? (
                              <img
                                src={`${config.book_image_path}${item.book.cover_image}`}
                                alt={item.book.name || "Book cover"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center rounded-md">
                                <FaBook className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                {item.book?.name || "Unknown Book"}
                              </h4>
                              <p className="text-sm text-gray-500">by {item.book?.author || "Unknown Author"}</p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <p className="text-lg font-semibold text-gray-900">
                                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ${parseFloat(item.price).toFixed(2)} each</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Order Summary */}
                    <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Payment Status:</p>
                          <div>
                            <span className={`mt-1 px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                              order.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.payment_status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total ({order.order_items.length} items)</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${parseFloat(order.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    {/* <div className="px-6 py-4 flex justify-end space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        View Invoice
                      </motion.button>
                      {order.order_status === "pending" && order.payment_status === "unpaid" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors duration-200"
                        >
                          Complete Payment
                        </motion.button>
                      )}
                    </div> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Clear Old Orders Modal */}
      <AnimatePresence>
        {showClearOldModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowClearOldModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Clear Old Orders</h3>
                <button
                  onClick={() => setShowClearOldModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                This will remove all orders older than 3 months from your view. 
                Are you sure you want to proceed?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowClearOldModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={clearOldOrders}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Clear Old Orders
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserOrderList;