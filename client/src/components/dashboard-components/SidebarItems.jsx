import React from "react";
import { NavLink } from "react-router";
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
  Trophy,
  FilePlus2,
  ClipboardList,
} from "lucide-react";
// import { FaQuestionCircle } from "react-icons/fa";

export const SidebarItem = ({ to, icon, label, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-base font-medium ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
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
        end
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
      <SidebarItem
        to="/dashboard/admin/quizzes"
        icon={<FilePlus2 size={20} />}
        label="Add Quizzes"
      />
      <SidebarItem
        to="/dashboard/admin/manage"
        icon={<ClipboardList size={20} />}
        label="Manage Quizzes"
      />

      <SidebarItem
        to="/dashboard/admin/showquizzeuser"
        icon={<Users size={20} />}
        label="Show Quizz Results"
      />
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

      {/* <SidebarItem
        to="/dashboard/courses"
        icon={<BookOpen size={20} />}
        label="Courses"
        isActive={location.pathname.includes("/dashboard/courses")}
      /> */}

      <SidebarItem
        to="/dashboard/courses"
        icon={<BookOpen size={20} />}
        label="Courses"
      />
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

      <SidebarItem
        to="/dashboard/quizzes"
        icon={<Trophy size={20} />}
        label="Participate in quizzes"
      />
    </>
  );
};
