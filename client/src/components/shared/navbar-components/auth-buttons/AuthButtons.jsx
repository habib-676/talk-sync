import React from "react";
import { Link } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import toast from "react-hot-toast";

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
          <Link to="/auth/signin">
            <button className="bg-primary text-white font-medium px-4 py-2 rounded cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
              Sign In
            </button>
          </Link>
          <Link to="/auth/register">
            <button className="btn btn-outline bg-base-100 text-primary font-medium px-4 py-2 rounded cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;

