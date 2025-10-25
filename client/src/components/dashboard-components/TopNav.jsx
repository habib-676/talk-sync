import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Menu,
  Bell,
  Sun,
  User as UserIcon,
  Settings,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const TopNav = ({ setSidebarOpen, user }) => {
  const { logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    toast
      .promise(logOut(), {
        loading: "Signing out...",
        success: "Signed out successfully!",
        error: "Failed to sign out.",
      })
      .finally(() => setDropdownOpen(false));
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-md border-b border-gray-100 p-2 flex items-center justify-between">
      {/* Mobile Menu Button - Left Aligned */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="Open Sidebar"
      >
        <Menu size={24} />
      </button>

      <div className="hidden lg:block">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Right side of TopNav - Icons and User Profile */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Theme Button*/}
        <button
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative group"
          title="Light Mode (Theme not implemented)"
          disabled
        >
          <Sun
            size={20}
            className="text-yellow-500 group-hover:rotate-12 transition-transform"
          />
          {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span> */}
        </button>
        {/* Notification Icon */}
        <button
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>{" "}
          {/* Pulsing notification dot */}
        </button>
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <img
              src={user?.photoURL || "https://i.ibb.co/qFxm3zW/user.png"}
              alt="User Avatar"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-transparent ring-2 ring-blue-400"
            />
            <span className="font-semibold text-gray-800 hidden md:block text-sm">
              {user?.displayName || "User"}
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 transform origin-top-right animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100 text-sm text-gray-500">
                Signed in as{" "}
                <span className="font-semibold text-gray-800">
                  {user?.email || "Guest"}
                </span>
              </div>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <UserIcon size={16} /> My Profile
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} /> Settings
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
