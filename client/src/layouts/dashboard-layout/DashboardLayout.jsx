import React, { useState } from "react";
import { Outlet } from "react-router";
import useRole from "../../hooks/useRole";
import DashboardSidebar from "../../components/dashboard-components/DashboardSidebar";
import TopNav from "../../components/dashboard-components/TopNav";
import useAuth from "../../hooks/useAuth";

const DashboardLayout = () => {
  const { role, isLoading } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // simple loader
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>{" "}
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-3xl mb-4 animate-bounce">⚠️</div>
          <p className="text-gray-700 text-lg font-semibold">
            Unable to determine user role. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <DashboardSidebar
        role={role}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav
          role={role}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-6 md:p-8 lg:p-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
