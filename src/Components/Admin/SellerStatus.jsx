import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { request } from '../../utils/request';
import { profileStore } from '../../store/Pfile_store';

const CategoryManager = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check authentication status
  const isAuthenticated = !!profileStore.getState().access_token;

  // Fetch categories on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    } else {
      toast.error('Please login to manage categories');
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await request('categories', 'get');
      // Handle different API response structures
      const categoryData = response.data || response.categories || response || [];
      setCategories(categoryData);
    } catch (error) {
      toast.error('Failed to load categories: ' + (error.response?.data?.message || error.message));
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name } = formData;

    if (!name.trim()) newErrors.name = 'Name is required';
    else if (name.length > 255) newErrors.name = 'Name too long (max 255 chars)';
    else if (!/^[A-Za-z\s]+$/.test(name)) newErrors.name = 'Only English letters allowed';
    else if (categories.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== formData.id)) {
      newErrors.name = 'Category already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await request(`categories/${formData.id}`, 'put', { name: formData.name.trim() });
        toast.success('Category updated successfully');
      } else {
        await request('categories', 'post', { name: formData.name.trim() });
        toast.success('Category created successfully');
      }
      await fetchCategories();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} category`);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({ id: category.id, name: category.name });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await request(`categories/${id}`, 'delete');
      toast.success('Category deleted successfully');
      // Optimistically update the UI
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      console.error('Delete error:', error);
      // Refresh the list if deletion failed
      fetchCategories();
    }
  };

  const resetForm = () => {
    setFormData({ id: null, name: '' });
    setErrors({});
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Category Management</h2>
        <p className="text-red-500">Please login to access this feature</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Category Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Category' : 'Create New Category'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g. Electronics"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">All Categories</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No categories found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;