import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import AboutUs from "../pages/about-page/AboutUs";
import NotFound from "../components/not-found/NotFound";
import ContactUs from "../pages/contact-us/ContactUs";
import Login from "../components/shared/JoinWebsite/login/Login";
import SignUp from "../components/shared/JoinWebsite/SignUp/SignUp";
import AuthLayouts from "../layouts/AuthLayouts";
import blogs from "../pages/Blogs/blogs";
import BlogDetails from "../pages/Blogs/BlogDetails";
import Inbox from "../pages/inbox/Inbox";
import PrivateRoute from "../routes/PrivateRoute";
import FollowPage from "../pages/Follow.jsx/FollowPage";
import UserProfile from "../pages/Profile/UserProfile";
import EditProfile from "../pages/user-profile/edit-user-profile/EditProfile";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import OnBoarding from "../pages/on-boarding/OnBoarding";
import ScheduleSession from "../pages/ProfilePage/ScheduleSession/ScheduleSession";
import Overview from "../pages/dashboard/Overview";
import SessionsPage from "../pages/dashboard/SessionsPage";
import BadgesPage from "../pages/dashboard/BadgesPage";
import DashboardLayout from "../layouts/dashboard-layout/DashboardLayout";
import AdminHome from "../pages/Admin/AdminHome";
import AdminManageUsers from "../pages/Admin/AdminManageUsers";
import AdminAnalytics from "../pages/Admin/AdminAnalytics";
import AdminAnnouncements from "../pages/Admin/AdminAnnouncements";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/about",
        Component: AboutUs,
      },
      {
        path: "/blogs",
        Component: blogs,
      },
      {
        path: "/blogs/:id",
        Component: BlogDetails,
      },
      {
        path: "contact-us",
        Component: ContactUs,
      },
      {
        path: "/schedule",
        Component: ScheduleSession,
      },
      {
        path: "/profile/:userId",
        element: <UserProfile></UserProfile>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: "/dashboard/overview", element: <Overview /> },
      { path: "/dashboard/profile", element: <ProfilePage /> },
      {
        path: "/dashboard/profile/edit",
        element: (
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        ),
      },
      { path: "follow", element: <FollowPage /> },
      { path: "sessions", element: <SessionsPage /> },
      { path: "badges", element: <BadgesPage /> },
      { path: "inbox", element: <Inbox /> },
      {
        path:"admin", element:<AdminHome></AdminHome>
      },
      {
        path: "admin/users",
        element: <AdminManageUsers></AdminManageUsers>
      },
      {
        path:'admin/reports',
        element: <AdminAnalytics></AdminAnalytics>
      },
      {
        path: 'admin/announcements',
        element: <AdminAnnouncements></AdminAnnouncements>
      },
  
      { path: "/dashboard/follow", element: <FollowPage /> },
      { path: "/dashboard/sessions", element: <SessionsPage /> },
      { path: "/dashboard/badges", element: <BadgesPage /> },
      { path: "/dashboard/inbox", element: <Inbox /> },
    ],
  },
  
  {
    path: "/auth",
    element: <AuthLayouts></AuthLayouts>,
    children: [
      {
        path: "/auth/signin",
        Component: Login,
      },
      {
        path: "/auth/register",
        Component: SignUp,
      },
    ],
  },
  {
    path: "/onboarding",
    element: (
      <PrivateRoute>
        <OnBoarding />
      </PrivateRoute>
    ),
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
