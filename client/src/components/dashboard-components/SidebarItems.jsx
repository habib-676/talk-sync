import React from "react";
import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  User,
  Users,
  MessageSquare,
  Video,
  Award,
  BarChart3,
  Megaphone,
  BookOpen,
  Settings,
  Star,
} from "lucide-react";

export const SidebarItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <NavLink
      to={to}
<<<<<<< HEAD
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-base font-medium
        ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
=======
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
          : "text-accent hover:bg-base-300"
>>>>>>> aa3ab7f199f876cebe11c193c9240494f2d9b2e9
        }`}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export const AdminSidebarLinks = () => {
  return (
    <>
      <SidebarItem
        to="/dashboard/admin"
        icon={<LayoutDashboard size={20} />}
        label="Admin Home"
      />
      <SidebarItem
        to="/dashboard/admin/users"
        icon={<Users size={20} />}
        label="Manage Users"
      />
      <SidebarItem
        to="/dashboard/admin/reports"
        icon={<BarChart3 size={20} />}
        label="Reports & Analytics"
      />
      <SidebarItem
        to="/dashboard/admin/announcements"
        icon={<Megaphone size={20} />}
        label="Announcements"
      />
<<<<<<< HEAD
      {/* <SidebarItem
        to="/dashboard/admin/settings"
        icon={<Settings size={20} />}
        label="Settings"
      /> */}
=======

>>>>>>> aa3ab7f199f876cebe11c193c9240494f2d9b2e9
    </>
  );
};

export const LearnerSidebarLinks = () => {
  return (
    <>
      <SidebarItem
        to="/dashboard/overview"
        icon={<LayoutDashboard size={20} />}
        label="Overview"
      />
      <SidebarItem
        to="/dashboard/profile"
        icon={<User size={20} />}
        label="Profile"
      />
      <SidebarItem
        to="/dashboard/inbox"
        icon={<MessageSquare size={20} />}
        label="Inbox"
      />
<<<<<<< HEAD
      <SidebarItem
        to="/dashboard/courses"
        icon={<BookOpen size={20} />}
        label="My Courses"
      />
=======

      <SidebarItem
        to="/dashboard/courses"
        icon={<BookOpen size={20} />}
        label="Courses"
        isActive={location.pathname.includes("/dashboard/courses")}
      />


>>>>>>> aa3ab7f199f876cebe11c193c9240494f2d9b2e9
      <SidebarItem
        to="/dashboard/follow"
        icon={<Users size={20} />}
        label="Find a Partner"
      />
      <SidebarItem
        to="/dashboard/sessions"
        icon={<Video size={20} />}
        label="Live Sessions"
      />
      <SidebarItem
        to="/dashboard/badges"
        icon={<Star size={20} />}
        label="Badges & Rewards"
      />
      {/* <SidebarItem
        to="/dashboard/settings"
        icon={<Settings size={20} />}
        label="Settings"
      /> */}
    </>
  );
};
