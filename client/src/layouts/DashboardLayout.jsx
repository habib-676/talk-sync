import { Outlet, NavLink } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 space-y-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-6">TalkSync</h2>

        <nav className="space-y-3">
          <NavLink
            to="/dashboard/overview"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Summary
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            My Profile
          </NavLink>

          <NavLink
            to="/dashboard/friends"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Friends
          </NavLink>
          <NavLink
            to="/dashboard/sessions"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Sessions
          </NavLink>
          <NavLink
            to="/dashboard/badges"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Badges
          </NavLink>
          <NavLink
            to="/dashboard/messages"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Messages
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* This renders your nested page (e.g., Profile, Summary, etc.) */}
      </main>
    </div>
  );
};

export default DashboardLayout;
