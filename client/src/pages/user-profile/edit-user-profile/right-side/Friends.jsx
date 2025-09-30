import { Eye, UserRoundMinus } from "lucide-react";
import React from "react";

const Friends = () => {
  return (
    <section className="space-y-4 bg-base-300 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Friends (12)</h2>

      <div className="space-y-4">
        {/* list of friends and action button */}
        <div className="flex items-center justify-between">
          {/* photo and name of friend */}
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dnh9rdh01/image/upload/v1756112807/rlhh0w8p5tizu61g7fin.jpg"
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">Miguel Rodriguez</h3>
              <p className="text-sm text-gray-600">Native Japanese</p>
            </div>
          </div>
          {/* unfriend button */}
          <div>
            <button
              type="button"
              className="text-error cursor-pointer transform hover:scale-105 transition-all duration-300 hover:text-red-700"
            >
              <UserRoundMinus />
            </button>
          </div>
        </div>
        {/* view all friends button */}
        <button
          type="button"
          className="btn btn-sm w-full hover:bg-black hover:text-base-100 transition-colors duration-300"
        >
          <Eye /> View all friends
        </button>
      </div>
    </section>
  );
};

export default Friends;
