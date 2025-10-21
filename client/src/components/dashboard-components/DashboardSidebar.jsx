import React from "react";
import { AdminSidebarLinks, LearnerSidebarLinks } from "./SidebarItems";
import { Link, useNavigate } from "react-router";
import { X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const DashboardSidebar = ({ role, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setSidebarOpen(false);
      navigate("/");
    }
  };
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-lg  bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link to={"/"}>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TalkSync
              </h2>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                role === "admin"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              {role === "admin" ? "Administrator" : "Learner"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-6 overflow-y-auto">
          {role === "admin" ? <AdminSidebarLinks /> : <LearnerSidebarLinks />}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            // onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-3 w-full p-3 btn btn-warning rounded-lg transition-colors"
          >
            {/* {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"} */}
            Theme
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-3 btn btn-error rounded-lg transition-colors"
          >
            🔓 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
