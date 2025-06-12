import React, { useEffect, useState } from "react";
import uploadf from "../../Img/Admin/upload.png";
import { request } from "../../utils/request";
import { profileStore } from "../../store/Pfile_store";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfileForm = () => {
  const { user, funSetUser, funSetProfileImage } = profileStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreview(user.profile_image || uploadf);
    }
  }, [user]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, GIF)");
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!user || !user.id) {
      toast.error("User not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await request(`users/${user.id}/remove-profile-image`, "DELETE");
      
      if (response?.data?.user || response?.user) {
        const updatedUser = response?.data?.user || response?.user;
        funSetUser(updatedUser);
        funSetProfileImage(null);
        setPreview(uploadf);
        setImageFile(null);
        toast.success("Profile image removed successfully");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to delete profile image"
      );
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user || !user.id) {
      toast.error("User not found.");
      setIsSubmitting(false);
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      
      if (imageFile) {
        formData.append("profile_image", imageFile);
      }
      
      if (showDeleteConfirm && !imageFile) {
        formData.append("remove_profile_image", "true");
      }

      formData.append("_method", "PUT");

      const response = await request(`users/${user.id}`, "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const updatedUser = response?.data?.user || response?.user;
      if (updatedUser) {
        toast.success("Profile updated successfully");
        funSetUser(updatedUser);
        funSetProfileImage(updatedUser.profile_image || null);
        setImageFile(null);
        setShowDeleteConfirm(false);
        setPreview(updatedUser.profile_image || uploadf);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Profile Photo</h3>
            
            <div className="relative group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = uploadf;
                  }}
                />
              </div>
              
              {(preview && preview !== uploadf) && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  disabled={isSubmitting}
                  title="Remove photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            {showDeleteConfirm ? (
              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-sm text-gray-600 mb-2">Are you sure you want to delete this photo?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteImage}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center">
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
                  className={`inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {preview && preview !== uploadf ? "Change photo" : "Upload photo"}
                </label>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  placeholder="Email"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email address cannot be changed. Please contact support if you need to update your email.
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || "");
                    setPreview(user?.profile_image || uploadf);
                    setImageFile(null);
                    setShowDeleteConfirm(false);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;