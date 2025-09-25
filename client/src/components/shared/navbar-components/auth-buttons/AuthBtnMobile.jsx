import React from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../../../../hooks/useAuth";

const AuthButtons = () => {
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Sign out successful");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        toast.error("Error during logout");
      });
  };

  return (
    <div className="hidden lg:flex gap-4 items-center">
      {user ? (
        <div className="flex items-center gap-4">
          {/* Avatar or default icon that links to Profile */}
          <Link to="/profile">
            <div className="avatar cursor-pointer">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.photoURL || "/default-avatar.png"} // fallback if no photo
                  alt={user.displayName || "User"}
                />
              </div>
            </div>
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-error text-white font-medium px-4 py-2 rounded cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/auth/login">
            <button className="bg-primary text-white font-medium px-4 py-2 rounded cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
              Sign In
            </button>
          </Link>
          <Link to="/auth/register">
            <button className="bg-primary text-white font-medium px-4 py-2 rounded cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;