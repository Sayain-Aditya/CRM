import Sidebar from "./Leftbar/SideBar";
import { Outlet } from "react-router-dom";

const Layout = ({ setIsAuthenticated }) => {
  return (
    <div className="flex">
      <Sidebar setIsAuthenticated={setIsAuthenticated} />
      <div className="">
        <Outlet /> {/* Renders current child route */}
      </div>
    </div>
  );
};

export default Layout;
