import React from 'react';
import Sidebar from "./Leftbar/SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex">
        <Sidebar />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;