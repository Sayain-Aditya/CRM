import { useState } from "react";
import {
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  CameraIcon,
  Bars3Icon,
  IdentificationIcon,
  PowerIcon,
  UserCircleIcon,
  CalculatorIcon,
  QueueListIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';

const Sidebar = () => {
  const [openProducts, setOpenProducts] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [selected, setSelected] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      localStorage.clear(); // Clear any other local storage
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleItemClick = (title) => {
    setSelected(title);
    if (collapsed) setCollapsed(false);
    if (mobileOpen) setMobileOpen(false); // Close mobile sidebar on click
  };

  const handleGalleryClick = () => {
    if (collapsed) {
      setCollapsed(false); // Expand the sidebar if collapsed
    }
    setOpenGallery(!openGallery); // Toggle the Gallery dropdown
  };

  const sidebarContent = (
    <div
      className={`bg-gray-100 border-r h-full p-4 flex flex-col transition-all duration-300 ease-in-out shadow-lg no-print ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/icon.png" alt="Logo" className="w-10 h-10 rounded-lg" />
        {!collapsed && (
          <h1 className="text-xl font-bold font-serif tracking-wide text-gray-900">
            Shine Infosolution
          </h1>
        )}
      </div>

      {/* Navigation */}
      <div
        className={`flex flex-col gap-3 flex-grow ${
          collapsed ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <SidebarItem
          title="Dashboard"
          icon={<AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-500" />}
          to="/Dashboard"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="Customers"
          icon={<UserCircleIcon className="w-6 h-6 text-green-500" />}
          to="/CustomerList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="Leads"
          icon={<IdentificationIcon className="w-6 h-6 text-purple-500" />}
          to="/List"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />

        <SidebarDropdown
          title="Gallery"
          icon={<CameraIcon className="w-6 h-6 text-yellow-500" />}
          isOpen={openGallery}
          setIsOpen={handleGalleryClick}
          items={[
            { title: "Common", link: "/Common" },
            { title: "Hotel", link: "/Hotel" },
            { title: "Destination", link: "/Destination" },
          ]}
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
          setMobileOpen={setMobileOpen}
        />

        <SidebarItem
          title="Invoice"
          icon={<CalculatorIcon className="w-6 h-6 text-red-500" />}
          to="/InvoiceNewList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="Iternary"
          icon={<UserCircleIcon className="w-6 h-6" />}
          to="/IternaryTable"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="CarList"
          icon={<QueueListIcon className="w-6 h-6" />}
          to="/CarList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className={`flex items-center gap-2 text-red-600 hover:bg-red-100 p-3 rounded-lg transition-all duration-200 mt-4 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <PowerIcon className="w-6 h-6" />
        {!collapsed && <span className="font-medium">Logout</span>}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Hamburger for mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="no-print fixed top-4 left-4 z-50 bg-white rounded-lg p-2.5 md:hidden shadow-md hover:bg-gray-50 transition-colors"
      >
        {mobileOpen ? (
          <img src="/icon.png" alt="Logo" className="w-8 h-8" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Collapse Toggle for Desktop */}
      <div className="no-print absolute top-4 left-4 z-40 hidden md:flex flex-col items-center gap-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`bg-white rounded-lg p-2.5 shadow-md hover:bg-gray-50 transition-colors ${collapsed ? "w-13 h-13" : "w-12 h-12"}`}
        >
          {collapsed ? (
            <img src="/icon.png" alt="Logo" className="w-10 h-10" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="no-print hidden md:block">{sidebarContent}</div>

      {/* Sidebar for mobile with overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="no-print fixed top-0 left-0 w-64 h-full bg-white z-40 shadow-xl md:hidden">
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
    className={`relative group flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
      selected === title
        ? "bg-blue-50 text-blue-600 font-medium shadow-sm"
        : "hover:bg-gray-50 text-gray-700"
    } ${collapsed ? "justify-center" : ""}`}
  >
    <div className="w-5 h-5">{icon}</div>
    {!collapsed && <span className="text-sm">{title}</span>}

    {collapsed && (
      <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
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
