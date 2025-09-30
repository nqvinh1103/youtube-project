import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const MainLayout = () => {
  const [sideNavbar, setSideNavbar] = useState(true);
  const location = useLocation();

  // Auto-toggle sidebar visibility depending on route
  useEffect(() => {
    const isWatch = location.pathname.startsWith("/watch");
    setSideNavbar(!isWatch);
  }, [location.pathname]);

  const setSideNavbarHandler = useCallback((val) => {
    setSideNavbar(val);
  }, []);

  return (
    <>
      <Navbar
        setSideNavbarHandler={setSideNavbarHandler}
        sideNavbar={sideNavbar}
      />
      <div className="home">
        <Sidebar sideNavbar={sideNavbar} />
        <div style={{ width: "100%" }}>
          <Outlet context={{ sideNavbar }} />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
