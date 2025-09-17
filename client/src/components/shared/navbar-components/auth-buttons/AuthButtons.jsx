import React from "react";
import { Link } from "react-router";

const AuthButtons = () => {
  return (
    <div className="hidden lg:flex gap-4">
      <Link to="/signup">
        <button className="bg-primary text-white font-medium px-4 py-2 rounded cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
          Sign Up
        </button>
      </Link>
    </div>
  );
};

export default AuthButtons;
