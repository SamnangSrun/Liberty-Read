import React, { useEffect, useState } from "react";
import uploadf from "../../Img/Admin/upload.png";
import { request } from "../../utils/request";
import { profileStore } from "../../store/Pfile_store";
import { config } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/daoka4qqr/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "pf_user"; // <-- replace with your actual preset

const EditProfileForm = () => {
  const { user, funSetUser, funSetProfileImage } = profileStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreview(
        user.profile_image ? config.profile_image_path + user.profile_image : null
      );
      setCloudinaryImageUrl(null); // Reset cloudinary URL on user change
      setImageFile(null);
      setShowDeleteConfirm(false);
    }
  }, [user]);

  // Upload image to Cloudinary and get URL
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Image upload failed. Please try again.");
      return null;
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, GIF)");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setIsSubmitting(true);
      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(file);
      setIsSubmitting(false);

      if (uploadedUrl) {
        setCloudinaryImageUrl(uploadedUrl);
        setImageFile(file);

        // Preview from local file for instant feedback
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        setShowDeleteConfirm(false);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!user || !user.id) {
      toast.error("User not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await request(`users/${user.id}/remove-profile-image`, "delete");

      if (response?.data?.user) {
        funSetUser(response.data.user);
        funSetProfileImage(null);
        setPreview(null);
        setImageFile(null);
        setCloudinaryImageUrl(null);
        toast.success("Profile image removed successfully");
      } else if (response?.user) {
        funSetUser(response.user);
        funSetProfileImage(null);
        setPreview(null);
        setImageFile(null);
        setCloudinaryImageUrl(null);
        toast.success("Profile image removed successfully");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        "Delete failed: " +
          (error.response?.data?.message || error.message || "Unknown error")
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

      // If cloudinaryImageUrl exists, send the URL instead of file
      if (cloudinaryImageUrl) {
        formData.append("profile_image_url", cloudinaryImageUrl);
      } else if (imageFile) {
        // fallback, just in case
        formData.append("profile_image", imageFile);
      }

      if (showDeleteConfirm && !cloudinaryImageUrl && !imageFile) {
        formData.append("remove_profile_image", "true");
      }

      formData.append("_method", "PUT");

      const response = await request(`users/${user.id}`, "post", formData);

      const updatedUser = response?.data?.user || response?.user;
      if (updatedUser) {
        toast.success("Profile updated successfully");
        funSetUser(updatedUser);
        funSetProfileImage(updatedUser.profile_image || null);
        setImageFile(null);
        setCloudinaryImageUrl(null);
        setShowDeleteConfirm(false);

        setPreview(
          updatedUser.profile_image
            ? config.profile_image_path + updatedUser.profile_image
            : null
        );
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        "Update failed: " +
          (error.response?.data?.message || error.message || "Unknown error")
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
                  src={preview || uploadf}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {preview && preview !== uploadf && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  disabled={isSubmitting}
                  title="Remove photo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {showDeleteConfirm ? (
              <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to delete this photo?
                </p>
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
                  id="upload-profile-photo"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="upload-profile-photo"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block text-sm"
                >
                  {isSubmitting ? "Uploading..." : "Upload New Photo"}
                </label>
              </div>
            )}
          </div>

          {/* User Info Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-2/3 flex flex-col gap-6"
            encType="multipart/form-data"
          >
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-700 mb-1 font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 mb-1 font-semibold">
                Email (read-only)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                disabled
                className="border rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
