import React, { useEffect, useState } from "react";
import photo from "../../../../assets/about-page/mission-1.jpg";
import { Camera } from "lucide-react";
import { useFormContext } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UploadPhoto = () => {
  const { setValue, watch } = useFormContext();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const currentPhoto = watch("photo");

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      e.target.value = ""; // Clear the input even if no file was selected
      return;
    }

    // image validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, GIF).");
      e.target.value = ""; // Clear input after error and return
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB.");
      e.target.value = ""; // Clear input after error
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
        setValue("photo", res.data.secure_url, { shouldValidate: true }); //shouldValidate is a react-hook-form method
        toast.success("Photo uploaded successfully!");
      } else {
        // if cloudinary not response with secure url
        toast.error("Failed to get image URL from Cloudinary.");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("Cloudinary Upload Error:", error);
    } finally {
      setUploading(false);
      e.target.value = ""; // clear the input after process completes

      // Clean up local URL if an error occurred before setting it to a new valid photo
      if (localPreviewUrl && !currentPhoto && !watch("photo")) {
        // if no new photo is set
        URL.revokeObjectURL(localPreviewUrl);
        setPreview(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);
  return (
    <section className="bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Profile Photo</h2>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <img
          src={preview || currentPhoto || photo}
          alt="Upload Preview"
          className="w-52 h-52 object-cover object-center rounded-full"
        />
        <div>
          <input
            type="file"
            id="photo-upload"
            accept="image/jpeg, image/jpg, image/png, image/gif"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <label
            htmlFor="photo-upload"
            aria-label="Upload Profile Photo"
            className={`btn bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-base-100 mb-4 ${
              uploading ? "btn-loading cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <Camera /> {uploading ? "Uploading..." : "Change Photo"}
          </label>
          <p className="text-gray-600">JPG, GIF or PNG. Max size 2MB</p>
          {uploading && (
            <p className="text-blue-500 text-sm mt-2">
              Uploading your photo...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadPhoto;
