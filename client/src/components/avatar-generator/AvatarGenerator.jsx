import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const AvatarGenerator = () => {
  const [avatar, setAvatar] = useState("https://avatar.iran.liara.run/public");
  const [loading, setLoading] = useState(false);
  const { setValue } = useFormContext();

  const generateAvatar = async (gender) => {
    const url = `https://avatar.iran.liara.run/public/${gender}?t=${Date.now()}`;

    setLoading(true);

    // Preload image
    const img = new Image();
    img.onload = () => {
      setAvatar(url);
      setValue("image", url);
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="relative w-32 h-32 rounded-full shadow bg-gray-100 overflow-hidden">
        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            className="w-full h-full object-cover rounded-full"
          />
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        )}
      </div>

      <div>
        {/* <h4 className="text-lg font-medium">Generate Random Avatar: </h4> */}
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-info btn-sm rounded-full"
            onClick={() => generateAvatar("boy")}
            disabled={loading}
          >
            Boy Avatar
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm rounded-full"
            onClick={() => generateAvatar("girl")}
            disabled={loading}
          >
            Girl Avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarGenerator;
