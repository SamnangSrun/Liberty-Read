import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { request } from '../../utils/request';
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

  // ... keep your existing useEffect and other functions ...

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'cover_books');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
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
      // Validate form data
      if (!formData.name || !formData.author || !formData.category_name || 
          !formData.price || !formData.stock) {
        throw new Error('Please fill in all required fields');
      }

      let cloudinaryResponse = null;
      if (imageFile) {
        cloudinaryResponse = await uploadToCloudinary(imageFile);
      }

      // Prepare book data
      const bookData = {
        name: formData.name,
        author: formData.author,
        description: formData.description,
        category_name: formData.category_name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      // Add Cloudinary data if available
      if (cloudinaryResponse) {
        bookData.cover_image = cloudinaryResponse.secure_url;
        bookData.cover_public_id = cloudinaryResponse.public_id;
      }

      // Send to backend
      const response = await request('books', 'post', bookData);

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
                <div className="w-full lg:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-4 text-center">Book Cover</h3>
                        <div className="flex flex-col items-center">
                            <div className="mb-4 w-full h-64 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                                <img 
                                    src={image || uploadf} 
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
                                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {image ? 'Change Image' : 'Upload Cover Image'}
                            </label>
                            <p className="text-xs text-gray-500 mt-2">JPEG, PNG or GIF (Max 2MB)</p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-2/3">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-black">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Book Title *</label>
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
                                <label htmlFor="author" className="block text-sm font-medium mb-1">Author *</label>
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
                                <label htmlFor="description" className="block text-sm font-medium mb-1">Book Description</label>
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
                                    <label htmlFor="category_name" className="block text-sm font-medium mb-1">Category *</label>
                                    <select
                                        id="category_name"
                                        name="category_name"
                                        value={formData.category_name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                                        required
                                        disabled={isSubmitting || isLoadingCategories}
                                    >
                                        <option value="">{isLoadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium mb-1">Price *</label>
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
                                    <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock *</label>
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