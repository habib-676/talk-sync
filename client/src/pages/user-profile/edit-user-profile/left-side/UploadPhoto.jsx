import React, { useEffect, useState } from "react";
import { Camera, AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import useAuth from "../../../../hooks/useAuth";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UploadPhoto = () => {
  const { setValue, watch } = useFormContext();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const currentPhoto = watch("image");

  useEffect(() => {
    // Set initial preview if an image URL exists
    if (currentPhoto) {
      setPreview(currentPhoto);
    }
  }, [currentPhoto]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      e.target.value = "";
      return;
    }

    // image validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, GIF).");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB.");
      e.target.value = "";
      return;
    }

    // start upload
    setUploading(true);
    let localPreviewUrl = null;

    try {
      // Local preview for user
      localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);

      // Environment variables check
      if (!CLOUD_NAME || !UPLOAD_PRESET) {
        toast.error(
          "Cloudinary configuration missing. Please check environment variables."
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      if (res.data.secure_url) {
        setValue("image", res.data.secure_url, { shouldValidate: true });
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error("Failed to get image URL from Cloudinary.");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("Cloudinary Upload Error:", error);
      // Revert preview if upload fails and there was no previous photo
      if (!currentPhoto) {
        setPreview(null);
        setValue("image", "");
      }
    } finally {
      setUploading(false);
      e.target.value = ""; // Clear file input
    }
  };

  useEffect(() => {
    return () => {
      // Clean up URL object when component unmounts or preview changes
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const displayPhoto =
    preview || user?.photoURL || "https://via.placeholder.com/150?text=U"; // Default placeholder

  return (
    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Photo</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          <img
            src={displayPhoto}
            alt="Profile Preview"
            className="w-full h-full object-cover object-center rounded-full border-4 border-blue-200 shadow-md"
          />
          {uploading && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <span className="loading loading-spinner loading-md text-white"></span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <input
            type="file"
            id="photo-upload"
            accept="image/jpeg, image/jpg, image/png, image/gif"
            className="hidden"
            onChange={handlePhotoChange}
            disabled={uploading}
          />
          <label
            htmlFor="photo-upload"
            aria-label="Upload Profile Photo"
            className={`btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-3 px-6 shadow-md shadow-indigo-200 ${
              uploading
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            }`}
          >
            <Camera size={20} /> {uploading ? "Uploading..." : "Change Photo"}
          </label>
          <p className="text-gray-600 text-sm">JPG, GIF or PNG. Max size 2MB</p>
          {uploading && (
            <p className="text-blue-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle size={14} /> Uploading in progress...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadPhoto;
