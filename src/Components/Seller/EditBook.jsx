import React, { useState, useEffect } from 'react';
import uploadf from '../../Img/Admin/upload.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { request } from '../../utils/request';
import { useNavigate, useParams } from 'react-router-dom';
import { profileStore } from '../../store/Pfile_store';
import { config } from "../../utils/config";

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { access_token, user } = profileStore();
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        author: '',
        description: '',
        category_name: '',
        price: '',
        stock: 0
    });
    const [initialFormData, setInitialFormData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCover, setCurrentCover] = useState('');
    const [errors, setErrors] = useState({});

    // Authentication and authorization check
    useEffect(() => {
        if (!access_token || !user) {
            toast.error('Please log in to edit books');
            navigate('/login');
            return;
        }
        
        if (user.role !== 'seller') {
            toast.error('Only sellers can edit books');
            navigate('/seller/book-management');
        }
    }, [access_token, user, navigate]);

    // Fetch book and category data
    useEffect(() => {
        const fetchBookData = async () => {
            if (!access_token || user?.role !== 'seller') return;

            try {
                setIsLoading(true);
                const [bookResponse, categoriesResponse] = await Promise.all([
                    request(`books/${id}`, 'get'),
                    request('categories', 'get')
                ]);

                const bookData = bookResponse?.book || bookResponse?.data;
                const categoriesData = categoriesResponse?.categories || 
                                      categoriesResponse?.data || 
                                      categoriesResponse || [];

                if (!bookData) {
                    throw new Error('Book not found');
                }

                const initialData = {
                    name: bookData.name || '',
                    author: bookData.author || '',
                    description: bookData.description || '',
                    category_name: bookData.category?.name || '',
                    price: bookData.price || '',
                    stock: bookData.stock || 0
                };

                setFormData(initialData);
                setInitialFormData(initialData);
                setCategories(categoriesData);

                if (bookData.cover_image) {
                    const coverUrl = bookData.cover_image.startsWith('http') 
                        ? bookData.cover_image 
                        : `${config.book_image_path}${bookData.cover_image}`;
                    setCurrentCover(bookData.cover_image);
                    setImage(coverUrl);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error(error.response?.data?.message || 'Failed to load book data');
                navigate('/seller/book-management');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookData();
    }, [id, navigate, access_token, user]);

    const handleImageUpload = (event) => {
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

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Book title is required';
            isValid = false;
        }

        if (!formData.author.trim()) {
            newErrors.author = 'Author is required';
            isValid = false;
        }

        if (!formData.category_name) {
            newErrors.category_name = 'Category is required';
            isValid = false;
        } else if (!categories.some(cat => cat.name === formData.category_name)) {
            newErrors.category_name = 'Invalid category selected';
            isValid = false;
        }

        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
            isValid = false;
        }

        if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
            newErrors.stock = 'Valid stock quantity is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('_method', 'PUT');
            data.append('name', formData.name);
            data.append('author', formData.author);
            data.append('description', formData.description);
            data.append('category_name', formData.category_name);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            
            if (imageFile) {
                data.append('cover_image', imageFile);
            } else if (!image) {
                data.append('remove_cover', 'true');
            }

            const response = await request(`books/${id}`, 'post', data);
            
            if (response?.book || response?.data?.book) {
                toast.success('Book updated successfully!');
                setTimeout(() => navigate('/seller/book-management'), 1500);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            toast.error(error.response?.data?.message || 'Failed to update book');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setImage(currentCover || uploadf);
        setImageFile(null);
        setErrors({});
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center space-y-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Edit Book</h2>
                <p className="text-gray-600 mt-2">Update your book details and cover image</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-700 mb-6">Book Cover</h3>
                            
                            <div className="relative w-56 h-72 rounded-lg overflow-hidden shadow-md border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-all duration-200">
                                <img 
                                    src={image || uploadf} 
                                    alt="Book Cover Preview" 
                                    className={`w-full h-full object-cover ${!image ? 'opacity-40' : ''}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = uploadf;
                                    }}
                                />
                                
                                <label 
                                    htmlFor="upload"
                                    className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 cursor-pointer ${
                                        isSubmitting ? 'pointer-events-none' : ''
                                    }`}
                                >
                                    {(!image || image === uploadf) && (
                                        <div className="text-center p-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-500">Click to upload</p>
                                            <p className="text-xs text-gray-400">JPEG, PNG or GIF (Max 2MB)</p>
                                        </div>
                                    )}
                                </label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="upload"
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <div className="mt-6 flex space-x-3">
                                <label 
                                    htmlFor="upload" 
                                    className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                                        isSubmitting ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-300 cursor-pointer'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    {image && image !== uploadf ? 'Change' : 'Upload'}
                                </label>
                                
                                {currentCover && !imageFile && image !== uploadf && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImageFile(null);
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                                            isSubmitting ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-red-600 hover:bg-red-50 border border-red-300'
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-2/3 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Book Title
                                        <span className="text-red-500 ml-1">*</span>
                                        {errors.name && <span className="text-red-600 text-xs ml-2">{errors.name}</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.name ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                        } transition-colors duration-200`}
                                        placeholder="Enter book title"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                                        Author
                                        <span className="text-red-500 ml-1">*</span>
                                        {errors.author && <span className="text-red-600 text-xs ml-2">{errors.author}</span>}
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                            errors.author ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                        } transition-colors duration-200`}
                                        placeholder="Enter author name"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Book Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors duration-200"
                                        placeholder="Enter a detailed description of the book..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                            <span className="text-red-500 ml-1">*</span>
                                            {errors.category_name && <span className="text-red-600 text-xs ml-2">{errors.category_name}</span>}
                                        </label>
                                        <select
                                            id="category_name"
                                            name="category_name"
                                            value={formData.category_name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.category_name ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                            } transition-colors duration-200 appearance-none bg-white bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] bg-no-repeat bg-[right_0.75rem_center]`}
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price
                                            <span className="text-red-500 ml-1">*</span>
                                            {errors.price && <span className="text-red-600 text-xs ml-2">{errors.price}</span>}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                min="0.01"
                                                step="0.01"
                                                className={`w-full pl-8 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                    errors.price ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                                } transition-colors duration-200`}
                                                placeholder="0.00"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                            Stock
                                            <span className="text-red-500 ml-1">*</span>
                                            {errors.stock && <span className="text-red-600 text-xs ml-2">{errors.stock}</span>}
                                        </label>
                                        <input
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                                errors.stock ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                                            } transition-colors duration-200`}
                                            placeholder="Enter stock quantity"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-2">
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={isSubmitting}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-medium ${
                                            isSubmitting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        } transition-colors duration-200`}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white ${
                                            isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                        } transition-colors duration-200 flex items-center`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBook;