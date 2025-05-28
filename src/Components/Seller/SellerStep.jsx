import React, { useState } from 'react';
import BookImage from '../../Img/Index/Hero/book.png';
import { request } from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    store_name: '',
    phone_number: '',
    birthdate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.store_name.trim()) newErrors.store_name = 'Store name is required';
    } else if (step === 2) {
      if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
      else if (!/^\d{9,15}$/.test(formData.phone_number)) {
        newErrors.phone_number = 'Enter a valid phone number';
      }
      if (!formData.birthdate) newErrors.birthdate = 'Birthdate is required';
      else {
        const birthDate = new Date(formData.birthdate);
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
        
        if (birthDate > minAgeDate) {
          newErrors.birthdate = 'You must be at least 18 years old';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNext = () => {
    if (validateStep() && step < 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await request('request-sellers', 'post', formData);
      toast.success(response.message || "Request submitted successfully!");
      
      setFormData({
        name: '',
        store_name: '',
        phone_number: '',
        birthdate: '',
      });
      setStep(1);
      
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Submission failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-16">
        {/* Form Section */}
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-xl shadow-sm">
          <div className="mb-6">
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 h-1 mr-2 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    step === 1 ? 'bg-black w-1/2' : 'bg-black w-full'
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">Step {step} of 2</span>
            </div>
          </div>

          {step === 1 && (
            <div className="transition-opacity duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Let's start with your name & store</h2>
              <form>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2">What's your name?</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2">What's your store name?</label>
                  <input
                    type="text"
                    name="store_name"
                    placeholder="Enter your store name"
                    value={formData.store_name}
                    onChange={handleChange}
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 ${
                      errors.store_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    required
                  />
                  {errors.store_name && <p className="text-red-500 text-sm mt-1">{errors.store_name}</p>}
                </div>
                
                <div className="flex justify-between mt-8">
                  <button 
                    type="button" 
                    onClick={() => toast.info("Form canceled")}
                    className="border border-gray-300 px-4 md:px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-black text-white px-4 md:px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="transition-opacity duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm your information</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2">Mobile number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Enter phone number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 ${
                      errors.phone_number ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    required
                  />
                  {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                </div>
                
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2">Birthdate</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`border rounded-lg p-3 w-full focus:outline-none focus:ring-2 ${
                      errors.birthdate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                    }`}
                    required
                  />
                  {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>}
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border border-gray-300 px-4 md:px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`bg-black text-white px-4 md:px-6 py-2 rounded-lg hover:bg-gray-800 transition ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block animate-spin mr-2">↻</span>
                        Submitting...
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Image Section - Hidden on mobile */}
        <div className="hidden lg:block w-full max-w-md">
          <img 
            src={BookImage} 
            alt="Books" 
            className="w-full max-w-xs mx-auto transform hover:scale-105 transition-transform duration-300" 
          />
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;