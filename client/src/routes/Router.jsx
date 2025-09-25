import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import AboutUs from "../pages/about-page/AboutUs";
import NotFound from "../components/not-found/NotFound";
import ContactUs from "../pages/contact-us/ContactUs";
import Login from "../components/shared/JoinWebsite/login/Login";
import SignUp from "../components/shared/JoinWebsite/SignUp/SignUp";
import AuthLayouts from "../layouts/AuthLayouts";
<<<<<<< HEAD
import blogs from "../pages/Blogs/blogs";
import BlogDetails from "../pages/Blogs/BlogDetails";

=======
import PrivateRoute from "../routes/PrivateRoute";
import ProfilePage from "../pages/ProfilePage";
>>>>>>> 87446329cc9b2e69dd2fd52af0e2c4fd3d9fa5a9
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
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);