import React, { useState, useEffect } from 'react';
import uploadf from '../../Img/Admin/upload.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { request } from '../../utils/request';
import { config } from '../../utils/config';
import { useNavigate } from 'react-router-dom';

const AddBookForm = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null); // For preview
    const [uploadedImageUrl, setUploadedImageUrl] = useState(''); // Cloudinary URL or public ID
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
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isUploading, setIsUploading] = useState(false); // upload status

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${config.base_url_api}categories`);
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setCategories(data.categories || data.data || data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories. Please try again later.');
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Upload file to Cloudinary with error handling
    const uploadFile = async (file) => {
        try {
            setIsUploading(true);
            console.log(`Uploading ${file.name}...`);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'booksbooks'); // Your unsigned preset

            const response = await fetch(
                'https://api.cloudinary.com/v1_1/daoka4qqr/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const image = await response.json();
            console.log('Cloudinary upload response:', image);
            setIsUploading(false);
            return image.secure_url || image.url; // Return the uploaded image URL
        } catch (error) {
            setIsUploading(false);
            toast.error('Image upload failed. Please try again.');
            console.error('Upload error:', error);
            return null;
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image (JPEG, PNG, GIF)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        // Preview image locally
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const url = await uploadFile(file);
        if (url) {
            setUploadedImageUrl(url); // Save Cloudinary URL to send to backend
        } else {
            setImage(null);
            setUploadedImageUrl('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.name || !formData.author || !formData.category_name || !formData.price || !formData.stock) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            toast.error('Please enter a valid price');
            return;
        }

        if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
            toast.error('Please enter a valid stock quantity');
            return;
        }

        if (!uploadedImageUrl) {
            toast.error('Please upload a cover image');
            return;
        }

        setIsSubmitting(true);

        try {
            const data = {
                name: formData.name,
                author: formData.author,
                description: formData.description,
                category_name: formData.category_name,
                price: formData.price,
                stock: formData.stock,
                cover_image: uploadedImageUrl // Send URL, not file
            };

            const response = await request('books', 'post', data);
            console.log('API response:', response);

            toast.success('Book added successfully!');
            setFormData({
                name: '',
                author: '',
                description: '',
                category_name: '',
                price: '',
                stock: ''
            });
            setImage(null);
            setUploadedImageUrl('');
            setTimeout(() => navigate('/seller/book-management'), 1500);
        } catch (error) {
            console.error('Error adding book:', error);
            toast.error(error.response?.data?.message || 'Failed to add book');
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
                                disabled={isSubmitting || isUploading}
                            />
                            <label
                                htmlFor="upload"
                                className={`w-full text-center px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-colors ${
                                    isSubmitting || isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isUploading ? 'Uploading...' : image ? 'Change Image' : 'Upload Cover Image'}
                            </label>
                            <p className="text-xs text-gray-500 mt-2">JPEG, PNG or GIF (Max 2MB)</p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-2/3">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-black">
                        <div className="grid grid-cols-1 gap-6">
                            {/* form fields unchanged */}
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
                                    {isLoadingCategories ? (
                                        <p>Loading categories...</p>
                                    ) : (
                                        <select
                                            id="category_name"
                                            name="category_name"
                                            value={formData.category_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium mb-1">Price *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                                        placeholder="Enter price"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock </label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-black rounded focus:outline-none focus:ring-1 focus:ring-black"
                                        placeholder="Enter stock quantity"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploading}
                                    className="w-full py-3 bg-black text-white rounded hover:bg-gray-900 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Add Book'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBookForm;
