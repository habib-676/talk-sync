import React from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { Link } from "react-router";

const TopNav = ({
  role,
  sidebarOpen,
  setSidebarOpen,
  // darkMode,
  // setDarkMode,
  user,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            // onClick={() => setDarkMode(!darkMode)}
            className="p-2 btn btn-warning rounded-lg lg:hidden"
          >
            {/* {darkMode ? <Sun size={20} /> : <Moon size={20} />} */}
            Theme
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.displayName}</p>
              <p className="text-xs text-gray-500">
                {role === "admin" ? "Administrator" : "Learner"}
              </p>
            </div>
            <Link to={"/dashboard/profile"}>
              <img
                src={user?.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-200"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
