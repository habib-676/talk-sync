import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

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
