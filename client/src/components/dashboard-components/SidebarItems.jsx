import React from "react";
import { Link, useLocation } from "react-router";
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
} from "lucide-react";

export const SidebarItem = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
          : "text-accent hover:bg-base-300"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const AdminSidebarLinks = () => {
  const location = useLocation();
  return (
    <>
      <SidebarItem
        to="/dashboard/admin"
        icon={<LayoutDashboard size={20} />}
        label="Admin Home"
        isActive={location.pathname === "/dashboard/admin"}
      />
      <SidebarItem
        to="/dashboard/admin/users"
        icon={<Users size={20} />}
        label="Manage Users"
        isActive={location.pathname.includes("/dashboard/admin/users")}
      />
      <SidebarItem
        to="/dashboard/admin/reports"
        icon={<BarChart3 size={20} />}
        label="Reports & Analytics"
        isActive={location.pathname.includes("/dashboard/admin/reports")}
      />
      <SidebarItem
        to="/dashboard/admin/announcements"
        icon={<Megaphone size={20} />}
        label="Announcements"
        isActive={location.pathname.includes("/dashboard/admin/announcements")}
      />

    </>
  );
};

export const LearnerSidebarLinks = () => {
  const location = useLocation();
  return (
    <>
      <SidebarItem
        to="/dashboard/overview"
        icon={<LayoutDashboard size={20} />}
        label="Overview"
        isActive={location.pathname === "/dashboard/overview"}
      />
      <SidebarItem
        to="/dashboard/profile"
        icon={<User size={20} />}
        label="Profile"
        isActive={location.pathname === "/dashboard/profile"}
      />
      <SidebarItem
        to="/dashboard/inbox"
        icon={<MessageSquare size={20} />}
        label="Inbox"
        isActive={location.pathname.includes("/dashboard/inbox")}
      />

      <SidebarItem
        to="/dashboard/courses"
        icon={<BookOpen size={20} />}
        label="Courses"
        isActive={location.pathname.includes("/dashboard/courses")}
      />


      <SidebarItem
        to="/dashboard/follow"
        icon={<Users size={20} />}
        label="Find a partner"
        isActive={location.pathname.includes("/dashboard/follow")}
      />
      <SidebarItem
        to="/dashboard/sessions"
        icon={<Video size={20} />}
        label="Sessions"
        isActive={location.pathname.includes("/dashboard/sessions")}
      />
      <SidebarItem
        to="/dashboard/badges"
        icon={<Award size={20} />}
        label="Badges"
        isActive={location.pathname.includes("/dashboard/badges")}
      />
    </>
  );
};