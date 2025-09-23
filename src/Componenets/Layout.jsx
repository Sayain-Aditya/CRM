import React, { useState } from 'react';
import Sidebar from "./Leftbar/SideBar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isPdfPage = location.pathname.includes('/IternaryField/');

  return (
    <div className="h-full flex flex-col">
      <div className="flex">
        {!isPdfPage && <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
        <div className="flex-1">
          <Outlet context={{ setSidebarCollapsed }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;