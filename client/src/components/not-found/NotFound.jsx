import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-secondary/10 px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated/Styled 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent opacity-80">
            4<span className="inline-block text-primary animate-bounce">0</span>
            4
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Lost in Translation?
        </h2>
        <p className="text-lg text-base-content/80 mb-10  mx-auto">
          It seems the page you're looking for doesn't exist. Maybe it moved, or
          perhaps you mistyped the address. Let's get you back to practicing
          languages!
        </p>

        {/* Helpful Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300">
              ↳ Back to Home
            </button>
          </Link>
          <Link to="/contact">
            <button className="btn btn-outline btn-lg rounded-full px-8 border-2 border-base-content/20 hover:border-accent hover:bg-accent/10 transition-all duration-300">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
