import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { request } from '../../utils/request';
import { profileStore } from '../../store/Pfile_store';
import { FiUser, FiMail, FiKey, FiTrash2, FiRefreshCw, FiEdit, FiLoader } from 'react-icons/fi';

const UserManager = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Current user data and permissions
  const { user: currentUser, permission } = profileStore();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await request('users', 'get');
      console.log('Users API Response:', response); // Debug log
      
      // Handle different API response structures
      const userData = response.data || response.users || response || [];
      setUsers(userData);
    } catch (error) {
      console.error('Fetch Users Error:', {
        error,
        response: error.response,
        message: error.message
      });
      toast.error('Failed to load users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Enhanced delete function with better error handling
  const handleDelete = async (userId) => {
    if (!window.confirm(`Are you sure you want to delete user #${userId}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(userId);
      console.log('Attempting to delete user:', userId); // Debug log
      
      const response = await request(`users/${userId}`, 'delete');
      console.log('Delete Response:', response); // Debug log
      
      toast.success(`User #${userId} deleted successfully`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Delete Error:', {
        error,
        response: error.response,
        message: error.message
      });
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(null);
    }
  };

  // Update user role function
  const handleRoleChange = async (userId, newRole) => {
    try {
      await request(`users/${userId}/role`, 'put', { role: newRole });
      toast.success('User role updated successfully');
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
      console.error('Role update error:', error);
    }
  };

  // Filter and pagination logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Enhanced Header with Search and Filters */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <FiUser className="mr-2 text-blue-600" />
                User Management
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiUser className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="seller">seller</option>
                <option value="customer">customer</option>
              </select>
              
              <button
                onClick={fetchUsers}
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 text-gray-400">
              <FiUser className="w-full h-full" />
            </div>
            <p className="mt-3 text-gray-500">No users found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
              }}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiKey className="mr-1 opacity-70" /> ID
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiUser className="mr-1 opacity-70" /> Name
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiMail className="mr-1 opacity-70" /> Email
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {permission.includes('update_roles') ? (
                          <select
                            value={user.role || 'user'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-gray-100 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="user">User</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit User"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={isDeleting === user.id || user.id === currentUser?.id}
                            className={`p-1 rounded transition-colors ${
                              user.id === currentUser?.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                            }`}
                            title={
                              user.id === currentUser?.id
                                ? "Cannot delete yourself"
                                : "Delete user"
                            }
                          >
                            {isDeleting === user.id ? (
                              <FiLoader className="animate-spin" size={16} />
                            ) : (
                              <FiTrash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredUsers.length}</span> users
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManager;