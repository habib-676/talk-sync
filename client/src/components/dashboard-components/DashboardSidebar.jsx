import React from "react";
import { AdminSidebarLinks, LearnerSidebarLinks } from "./SidebarItems";
import { Link } from "react-router"; 
import { X, LogOut, Sun } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const DashboardSidebar = ({ role, sidebarOpen, setSidebarOpen }) => {
  const { logOut } = useAuth();

  const handleLogout = () => {
    toast.promise(logOut(), {
      loading: "Signing out...",
      success: "Signed out successfully!",
      error: "Failed to sign out.",
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-2xl bg-opacity-60 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col 
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          border-r border-gray-100`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link to={"/"} className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TalkSync
            </h2>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Indicator */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold 
              ${
                role === "admin"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1 ${
                role === "admin" ? "bg-red-500" : "bg-green-500"
              }`}
            />
            {role === "admin" ? "Administrator" : "Learner"} Dashboard
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {" "}
          {role === "admin" ? <AdminSidebarLinks /> : <LearnerSidebarLinks />}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          {/* Light Mode Button */}
          <button
            className="flex items-center justify-center gap-3 w-full p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            disabled
          >
            <Sun size={20} className="text-yellow-500" /> Light Mode
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
