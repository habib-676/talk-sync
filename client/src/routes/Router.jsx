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
import UserProfile from "../pages/Profile/userProfile";
import Profile from "../pages/ProfilePage/Profile";
import EditProfile from "../pages/user-profile/edit-user-profile/EditProfile";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import OnBoarding from "../pages/on-boarding/OnBoarding";
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
        Component: AboutUs, //added by asif
      },
      {
        path: "/blogs",
        Component: blogs, //added by amena
      },
      {
        path: "/blogs/:id",
        Component: BlogDetails, //added by amena
      },
      {
        path: "/inbox",
        element: (
          <PrivateRoute>
            <Inbox />
          </PrivateRoute>
        ),
      },
      {
        path: "contact-us",
        Component: ContactUs,
      },
      {
        path: "/follow", //added by jannatul
        Component: FollowPage,
      },
      {
        path: "/profile/:username",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayouts></AuthLayouts>, //added by Jannatul
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
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
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
