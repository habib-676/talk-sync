import React, { useState } from "react";
import photo from "../../../../assets/about-page/mission-1.jpg";
import { Camera } from "lucide-react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UploadPhoto = () => {
  const { setValue } = useFormContext();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    //validation for file type and size can be added here
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB");
      return;
    }

    // Local preview for user
    setPreview(URL.createObjectURL(file));

    // Prepare upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );

      setUploading(false);

      if (res.data.secure_url) {
        // Save Cloudinary URL into form
        setValue("photo", res.data.secure_url);
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("Cloudinary Upload Error:", error);
      setUploading(false);
    }
  };
  return (
    <div className="bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Profile Photo</h2>
      <div className="flex items-center gap-4">
        <img
          src={preview || photo}
          alt="Upload Preview"
          className="w-52 h-52 object-cover object-center rounded-full"
        />
        <div>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <label
            htmlFor="photo-upload"
            aria-label="Upload Profile Photo"
            className={`btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-base-100 mb-4 ${
              uploading ? "loading" : ""
            }`}
          >
            <Camera /> {uploading ? "Uploading..." : "Change Photo"}
          </label>
          <p className="text-gray-600">JPG, GIF or PNG. Max size 2MB</p>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;
