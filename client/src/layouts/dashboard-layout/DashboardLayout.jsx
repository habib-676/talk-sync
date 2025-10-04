import React from "react";
import { Outlet, Link } from "react-router";
import useRole from "../../hooks/useRole";

const DashboardLayout = () => {
  const { role, isLoading } = useRole();
  console.log("role from dash", role);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen">
        Unable to determine role
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-5">TalkSync Dashboard</h2>

        {role === "admin" && (
          <>
            <Link to="/dashboard/admin" className="mb-2 hover:text-blue-500">
              Admin Home
            </Link>
            <Link
              to="/dashboard/admin/users"
              className="mb-2 hover:text-blue-500"
            >
              Manage Users
            </Link>
            <Link
              to="/dashboard/admin/reports"
              className="mb-2 hover:text-blue-500"
            >
              Reports
            </Link>
            <Link
              to="/dashboard/admin/announcements"
              className="mb-2 hover:text-blue-500"
            >
              Announcements
            </Link>
          </>
        )}

        {role === "learner" && (
          <>
            <Link to="/dashboard/learner" className="mb-2 hover:text-green-500">
              Learner Home
            </Link>
            <Link
              to="/dashboard/learner/my-courses"
              className="mb-2 hover:text-green-500"
            >
              My Conversations
            </Link>
            <Link
              to="/dashboard/learner/settings"
              className="mb-2 hover:text-green-500"
            >
              Settings
            </Link>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
