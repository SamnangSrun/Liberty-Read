import React, { useEffect, useState } from "react";
import { request } from "../../utils/request";
import { profileStore } from "../../store/Pfile_store";
import { config } from "../../utils/config";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfileForm = () => {
  const { user, funSetUser, funSetProfileImage } = profileStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageData, setImageData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cloudinaryConfig, setCloudinaryConfig] = useState(null);

  // Fetch Cloudinary config when component mounts
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await request('cloudinary/signature', 'get');
        setCloudinaryConfig(response.data);
      } catch (error) {
        console.error("Failed to get Cloudinary config:", error);
        toast.error("Failed to initialize image upload");
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreview(user.profile_image || null);
    }
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsSubmitting(true);
    try {
      // Option 1: Upload directly to your server which then uploads to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await request('cloudinary/upload', 'post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setPreview(response.secure_url);
      setImageData(response);
      toast.success("Image uploaded successfully");

      // Option 2: Or upload directly to Cloudinary from frontend
      /*
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.upload_preset);
      formData.append('cloud_name', cloudinaryConfig.cloud_name);
      
      const response = await fetch(config.cloudinary_upload_url, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setPreview(data.secure_url);
      setImageData(data);
      toast.success("Image uploaded successfully");
      */
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed: " + error.message);
    } finally {
      setIsSubmitting(false);
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
      const payload = {
        name,
        email,
        _method: "PUT"
      };

      if (imageData) {
        payload.profile_image_url = imageData.secure_url;
        payload.profile_public_id = imageData.public_id;
      } else if (showDeleteConfirm) {
        payload.remove_profile_image = true;
      }

      const response = await request(`users/${user.id}`, "post", payload);

      if (response?.data?.user) {
        toast.success("Profile updated successfully");
        funSetUser(response.data.user);
        funSetProfileImage(response.data.user.profile_image || null);
        setImageData(null);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit}>
        {/* Profile Image Upload */}
        <div className="mb-4">
          {preview ? (
            <img 
              src={preview} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span>No Image</span>
            </div>
          )}
          
          <input 
            type="file" 
            onChange={handleImageUpload}
            accept="image/jpeg,image/png,image/gif"
            disabled={isSubmitting}
          />
          
          {preview && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
            >
              Remove Image
            </button>
          )}
        </div>
        
        {/* Name and Email fields */}
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;