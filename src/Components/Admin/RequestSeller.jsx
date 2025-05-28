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
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await request('seller-requests', 'get');
        const sortedRequests = (response.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setSellerRequests(sortedRequests);
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
    let filtered = sellerRequests;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = sellerRequests.filter(req => req.status === statusFilter);
    }
    
    // Filter by search term
    const term = searchTerm.toLowerCase();
    return filtered.filter((req) =>
      (req.pf_name ?? '').toLowerCase().includes(term) ||
      (req.store_name ?? '').toLowerCase().includes(term) ||
      (req.user?.name ?? '').toLowerCase().includes(term)
    );
  }, [sellerRequests, searchTerm, statusFilter]);

  useEffect(() => {
    const maxPage = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
    if (currentPage > maxPage) setCurrentPage(1);
  }, [filteredRequests, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleActionClick = (req, action) => {
    setSelectedRequest(req);
    setActionType(action);
    setRejectionNote('');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;
    if (actionType === 'disapprove' && !rejectionNote.trim()) {
      toast.error('Please provide a rejection note');
      return;
    }

    try {
      let response;
      if (actionType === 'approve') {
        response = await request(`seller-requests/${selectedRequest.id}/approve`, 'post');
      } else {
        response = await request(`seller-requests/${selectedRequest.id}/disapprove`, 'post', {
          rejection_note: rejectionNote
        });
      }

      setSellerRequests(prev => prev.map(req =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: actionType === 'approve' ? 'approved' : 'disapproved',
              rejection_note: actionType === 'disapprove' ? rejectionNote : null
            }
          : req
      ));

      toast.success(`Request ${actionType === 'approve' ? 'approved' : 'disapproved'} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${actionType} request: ${error.response?.data?.message || error.message}`);
    } finally {
      setShowModal(false);
      setSelectedRequest(null);
      setActionType('');
      setRejectionNote('');
    }
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
        <h2 className="text-xl font-bold">Seller Requests</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md p-2"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="disapproved">Rejected</option>
          </select>
          
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name"
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-5 py-3">Profile</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Store</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 text-sm text-gray-500">#{req.id}</td>
                  <td className="px-6 py-4">
                    {req.user?.profile_image ? (
                      <img
                        src={`${config.profile_image_path}${req.user.profile_image}`}
                        alt={req.user.name || 'User'}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {(req.user?.name?.charAt(0) || 'U').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{req.user?.name || req.pf_name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{req.user?.email || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{req.store_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{req.phone_number || '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        req.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : req.status === 'disapproved'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {req.status || 'pending'}
                    </span>
                    {req.status === 'disapproved' && req.rejection_note && (
                      <div className="mt-1 text-xs text-gray-500">
                        Reason: {req.rejection_note}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleActionClick(req, 'approve')}
                      className="text-green-600 hover:text-green-800 disabled:opacity-50"
                      disabled={req.status !== 'pending'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleActionClick(req, 'disapprove')}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      disabled={req.status !== 'pending'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No {statusFilter === 'all' ? '' : statusFilter} requests found
                  {searchTerm && ` matching "${searchTerm}"`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} requests
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              Confirm {actionType}
            </h3>
            {actionType === 'disapprove' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Note
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="w-full border rounded-md p-2"
                  rows={3}
                  placeholder="Explain reason for rejection..."
                  required
                ></textarea>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestSellerTable;