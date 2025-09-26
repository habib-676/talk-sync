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
import Profile from "../pages/ProfilePage/Profile";
import EditProfile from "../pages/user-profile/edit-user-profile/EditProfile";
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
       Component: BlogDetails,//added by amena
      },
      {
        path: "/inbox",
        element: <Inbox />,
      },
      {
        path: "contact-us",
        Component: ContactUs,
      },
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
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile/>
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
    path: "*",
    element: <NotFound />,
  },
]);
