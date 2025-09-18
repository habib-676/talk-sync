import { Outlet } from "react-router";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/navbar-components/Navbar";

const MainLayout = () => {
  return (
    <div className="relative">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className=" min-h-[80vh]">
        <Outlet></Outlet>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
