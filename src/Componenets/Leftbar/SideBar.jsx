import { useState } from "react";
import {
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  CameraIcon,
  Bars3Icon,
  IdentificationIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Sidebar = () => {
  const [openProducts, setOpenProducts] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [selected, setSelected] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  const handleItemClick = (title) => {
    setSelected(title);
    if (collapsed) setCollapsed(false);
    if (mobileOpen) setMobileOpen(false); // Close mobile sidebar on click
  };

  const sidebarContent = (
    <div
      className={`bg-white border-r h-full p-4 flex flex-col transition-all duration-300 ease-in-out shadow-md no-print ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <img src="/src/assets/Logo.png" alt="Logo" className="w-10 h-10" />
        {!collapsed && (
          <h1 className="text-md font-bold font-serif tracking-wide">
            Shine Infosolution
          </h1>
        )}
      </div>

      {/* Navigation */}
      <div
        className={`flex flex-col gap-1 flex-grow ${
          collapsed ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <SidebarItem
          title="Dashboard"
          icon={<AdjustmentsHorizontalIcon className="w-5 h-5" />}
          to="/"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="Customers"
          icon={<UserCircleIcon className="w-5 h-5" />}
          to="/CustomerList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="Leads"
          icon={<IdentificationIcon className="w-5 h-5" />}
          to="/List"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        {/* <SidebarDropdown
          title="Products"
          icon={<Squares2X2Icon className="w-5 h-5" />}
          isOpen={openProducts}
          setIsOpen={setOpenProducts}
          items={[{ title: "Add Product", link: "/Products" }]}
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
          setMobileOpen={setMobileOpen} // ✅ pass this
        /> */}

        <SidebarDropdown
          title="Gallery"
          icon={<CameraIcon className="w-5 h-5" />}
          isOpen={openGallery} // ✅ Fix: use `openGallery` instead of `openProducts`
          setIsOpen={setOpenGallery}
          items={[
            { title: "Common", link: "/Common" },
            { title: "Hotel", link: "/Hotel" },
            { title: "Destination", link: "/Destination" },
          ]}
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
          setMobileOpen={setMobileOpen} // ✅ pass this
        />

        <SidebarItem
          title="Invoice"
          icon={<UserCircleIcon className="w-5 h-5" />}
          to="/InvoiceNewList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="Iternary"
          icon={<UserCircleIcon className="w-5 h-5" />}
          to="/IternaryTable"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className={`flex items-center gap-2 text-red-600 hover:bg-red-100 p-2 rounded-md transition ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <PowerIcon className="w-5 h-5" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Hamburger for mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="no-print fixed top-4 left-4 z-50 bg-white rounded-full p-2 md:hidden"
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Collapse Toggle for Desktop */}
      <div className="no-print absolute top-4 left-4 z-40 hidden md:flex flex-col items-center gap-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white rounded-full p-2 shadow"
        >
          {collapsed ? (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700 " />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="no-print hidden md:block">{sidebarContent}</div>

      {/* Sidebar for mobile with overlay */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          ></div>
          {/* Sidebar */}
          <div className="no-print fixed top-0 left-0 w-64 h-full bg-white z-40 shadow-lg md:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </div>
  );
};

const SidebarItem = ({ title, icon, to, selected, setSelected, collapsed }) => (
  <Link
    to={to}
    onClick={() => setSelected(title)}
    className={`relative group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
      selected === title
        ? "bg-blue-100 text-blue-600 font-medium"
        : "hover:bg-gray-100 text-gray-700"
    } ${collapsed ? "justify-center" : ""}`}
  >
    <div className="w-5 h-5">{icon}</div>
    {!collapsed && <span className="text-sm">{title}</span>}

    {collapsed && (
      <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-black text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {title}
      </span>
    )}
  </Link>
);

const SidebarDropdown = ({
  title,
  icon,
  isOpen,
  setIsOpen,
  items,
  selected,
  setSelected,
  collapsed,
  setMobileOpen, // ✅ receive it
}) => (
  <div>
    {/* Toggle dropdown */}
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        selected === title
          ? "bg-blue-100 text-blue-600 font-medium"
          : "hover:bg-gray-100 text-gray-700"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-5">{icon}</div>
        {!collapsed && <span className="text-sm">{title}</span>}
      </div>

      {!collapsed && (
        <ChevronDown
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      )}
    </div>

    {/* Dropdown items */}
    {!collapsed && isOpen && (
      <div className="ml-6 mt-1 flex flex-col gap-1 text-gray-600 text-sm animate-fade-in">
        {items.map((item, idx) => (
          <Link
            to={item.link}
            key={idx}
            onClick={() => {
              setSelected(item.title);
              setIsOpen(false); // optional: close dropdown
              if (setMobileOpen) setMobileOpen(false); // ✅ close mobile sidebar
            }}
            className={`pl-2 py-1 rounded-md transition-colors ${
              selected === item.title
                ? "bg-blue-100 text-blue-600"
                : "hover:text-black hover:bg-gray-100"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
