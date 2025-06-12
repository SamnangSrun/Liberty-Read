import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { request } from '../../utils/request'; // Make sure this utility handles API calls correctly
import { useNavigate } from 'react-router-dom';

const AddBookForm = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    author: '',
    description: '',
    category_name: '',
    price: '',
    stock: ''
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await request('categories', 'get');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async (file) => {
    const cloudFormData = new FormData();
    cloudFormData.append('file', file);
    cloudFormData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    cloudFormData.append('folder', 'cover_books');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudFormData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      return await response.json();
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (
        !formData.name.trim() ||
        !formData.author.trim() ||
        !formData.category_name ||
        !formData.price ||
        !formData.stock
      ) {
        throw new Error('Please fill in all required fields');
      }

      let cloudinaryResponse = null;
      if (imageFile) {
        cloudinaryResponse = await uploadToCloudinary(imageFile);
      }

      const bookData = {
        name: formData.name.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        category_name: formData.category_name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };

      if (cloudinaryResponse) {
        bookData.cover_image = cloudinaryResponse.secure_url;
        bookData.cover_public_id = cloudinaryResponse.public_id;
      }

      await request('books', 'post', bookData);

      toast.success('Book added successfully!');
      setTimeout(() => navigate('/seller/book-management'), 1500);
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(error.message || 'Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-8">Add New Book</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Upload Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4 text-center">Book Cover</h3>
            <div className="flex flex-col items-center">
              <div className="mb-4 w-full h-64 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                <img
                  src={image || 'https://via.placeholder.com/150'}
                  alt="Book Cover Preview"
                  className={`max-h-full max-w-full object-contain ${!image ? 'opacity-30' : ''}`}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="upload"
                disabled={isSubmitting}
              />
              <label
                htmlFor="upload"
                className={`w-full text-center px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {image ? 'Change Image' : 'Upload Cover Image'}
              </label>
              <p className="text-xs text-gray-500 mt-2">JPEG, PNG or GIF (Max 2MB)</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-black">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter book title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter author name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Book Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter book description"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="category_name" className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <select
                    id="category_name"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                    required
                    disabled={isSubmitting || isLoadingCategories}
                  >
                    <option value="">{isLoadingCategories ? 'Loading...' : 'Select a category'}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2">$</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      className="w-full pl-8 px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="0.00"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Enter stock quantity"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className={`px-6 py-2 border border-black rounded hover:bg-gray-100 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoadingCategories}
                className={`px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors ${
                  isSubmitting || isLoadingCategories ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Adding...' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookForm;
