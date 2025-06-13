import React from 'react';
import Sidebar from "./Leftbar/SideBar";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = ({ onLogout, user }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <div className="flex">
        <Sidebar />
        <div className="">
          <Outlet /> {/* Renders current child route */}
        </div>
      </div>
      
      {/* Add user info and logout button */}
      {/* <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}`}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Layout;
