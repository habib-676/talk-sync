import React, { useState } from "react";
import { Outlet } from "react-router";
import useRole from "../../hooks/useRole";
import DashboardSidebar from "../../components/dashboard-components/DashboardSidebar";
import TopNav from "../../components/dashboard-components/TopNav";
import useAuth from "../../hooks/useAuth";

const DashboardLayout = () => {
  const { role, isLoading } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

  // simple loader
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-700">Unable to determine role</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden `}>
      {/* coming from dashboard-components */}
      <DashboardSidebar
        role={role}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        // darkMode={darkMode}
        // setDarkMode={setDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          // darkMode={darkMode}
          // setDarkMode={setDarkMode}
          user={user}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
