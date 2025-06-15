import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimesCircle, 
  faCheckCircle,
  faChevronRight, 
  faCheck 
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { request } from '../../utils/request';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NotificationsPage() {
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [read, setRead] = useState(false);

  useEffect(() => {
    const fetchSellerRequest = async () => {
      try {
        const response = await request('my-seller-request');
        
        if (response === null) {
          setError('Seller request endpoint not available');
          return;
        }

        if (response && (response.status === 'disapproved' || response.status === 'approved')) {
          setRequestStatus(response);
        } else {
          setRequestStatus(null);
        }
      } catch (error) {
        console.error('Error fetching seller request:', error);
        setError(error.message || 'Failed to load seller request status');
        toast.error('Failed to load seller request status');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerRequest();
  }, []);

  const markAsRead = () => {
    setRead(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon 
              icon={requestStatus?.status === 'approved' ? faCheckCircle : faTimesCircle} 
              className={`h-5 w-5 ${
                requestStatus?.status === 'approved' ? 'text-green-500' : 'text-[#102249]'
              }`} 
            />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">Seller Request Status</h1>
            {requestStatus && !read && (
              <span className={`ml-2 text-white text-xs font-medium px-2 py-0.5 rounded-full ${
                requestStatus.status === 'approved' ? 'bg-green-500' : 'bg-[#102249]'
              }`}>
                1 unread
              </span>
            )}
          </div>
          {requestStatus && !read && (
            <button
              onClick={markAsRead}
              className="text-sm text-[#102249] hover:text-[#0a1a3a] font-medium"
            >
              Mark as read
            </button>
          )}
        </div>

        {/* Notification Content */}
        {requestStatus ? (
          <div className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
            !read ? requestStatus.status === 'approved' ? 'bg-green-50' : 'bg-red-50' : ''
          }`}>
            <div className="flex items-start">
              {/* Status Icon */}
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                requestStatus.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <FontAwesomeIcon 
                  icon={requestStatus.status === 'approved' ? faCheckCircle : faTimesCircle} 
                  className="h-4 w-4" 
                />
              </div>

              {/* Content */}
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {requestStatus.status === 'approved' 
                      ? 'Seller Request Approved' 
                      : 'Seller Request Rejected'}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
  {requestStatus.status === 'approved'
    ? <>
        Congratulations! Your seller application has been approved.  You can now start selling on our platform.<br />
          <strong>Important</strong> Please log out and log in again to:<br />
                        - See your new seller role<br />
                        - Update your profile information<br />
      </>
    : `Your seller application was rejected. Reason: ${requestStatus.rejection_note || 'No reason provided'}`}
</p>
                
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No seller request status</h3>
            <p className="mt-1 text-sm text-gray-500">
              {loading ? 'Checking your application status...' : 'You have no active seller application.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}