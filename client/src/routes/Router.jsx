import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import AboutUs from "../pages/about-page/AboutUs";
import NotFound from "../components/not-found/NotFound";
import ContactUs from "../pages/contact-us/ContactUs";
import Login from "../components/shared/JoinWebsite/login/Login";
import SignUp from "../components/shared/JoinWebsite/SignUp/SignUp";
import AuthLayouts from "../layouts/AuthLayouts";
import Inbox from "../pages/inbox/Inbox";

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
    path: "*",
    Component: NotFound,
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
]);
