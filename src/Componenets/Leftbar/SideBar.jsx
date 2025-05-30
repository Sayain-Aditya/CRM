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
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Logo from "../../assets/Logo.png"; // Fixed logo import

const Sidebar = () => {
  const [openProducts, setOpenProducts] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [selected, setSelected] = useState("");
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed
  const [hovered, setHovered] = useState(false); // New hover state
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
    if (mobileOpen) setMobileOpen(false); // Close mobile sidebar on click
  };

  const sidebarContent = (
    <div
      className={`bg-gradient-to-r from-purple-300 to-purple-200 text-white border-r-4 border-purple-500 rounded-sm h-full p-4 flex flex-col transition-all duration-300 ease-in-out shadow-lg no-print ${
        collapsed && !hovered ? "w-16" : "w-64"
      }`}
      onMouseEnter={() => setHovered(true)} // Expand on hover
      onMouseLeave={() => setHovered(false)} // Collapse when hover ends
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <img src={Logo} alt="Logo" className="w-10 h-10 rounded-full shadow-md" />
        {!collapsed && !hovered && (
          <h1 className="text-md font-bold font-serif tracking-wide text-white">
            Shine Infosolution
          </h1>
        )}
      </div>

      {/* Navigation */}
      <div
        className={`flex flex-col gap-1 flex-grow ${
          collapsed && !hovered ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <SidebarItem
          title="Dashboard"
          icon={<AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />}
          to="/"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed && !hovered}
        />
        <SidebarItem
          title="Customers"
          icon={<UserCircleIcon className="w-5 h-5 text-white" />}
          to="/CustomerList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed && !hovered}
        />
        <SidebarItem
          title="Leads"
          icon={<IdentificationIcon className="w-5 h-5 text-white" />}
          to="/List"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed && !hovered}
        />

        <SidebarDropdown
          title="Gallery"
          icon={<CameraIcon className="w-5 h-5 text-white absolute left-[20px]" />}
          isOpen={openGallery}
          setIsOpen={setOpenGallery}
          items={[
            { title: "Common", link: "/Common" },
            { title: "Hotel", link: "/Hotel" },
            { title: "Destination", link: "/Destination" },
          ]}
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed && !hovered}
          setMobileOpen={setMobileOpen}
        />

        <SidebarItem
          title="Invoice"
          icon={<UserCircleIcon className="w-5 h-5 text-white" />}
          to="/InvoiceNewList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed && !hovered}
        />
        <SidebarItem
          title="Iternary"
          icon={<CalculatorIcon className="w-5 h-5 text-white" />}
          to="/IternaryTable"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed && !hovered}
        />
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className={`bg-red-500 flex items-center gap-2 text-white hover:bg-red-700 p-2 rounded-md transition ${
          collapsed && !hovered ? "justify-center" : ""
        }`}
      >
        <PowerIcon className="w-5 h-5 text-white" />
        {!collapsed && !hovered && <span>Logout</span>}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Hamburger for mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="no-print fixed top-4 left-4 z-50 bg-purple-500 rounded-full p-2 md:hidden shadow-md hover:bg-purple-700"
      >
        <Bars3Icon className="w-6 h-6 text-white" />
      </button>

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
          <div className="no-print fixed top-0 left-0 w-64 h-full bg-gradient-to-r from-purple-500 to-purple-700 text-white z-40 shadow-lg md:hidden">
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
        ? "bg-purple-500 text-white font-medium"
        : "hover:bg-purple-600 text-white"
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
  setMobileOpen,
}) => (
  <div>
    {/* Toggle dropdown */}
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        selected === title
          ? "bg-purple-700 text-white font-medium"
          : "hover:bg-purple-600 text-white"
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
      <div className="ml-6 mt-1 flex flex-col gap-1 text-white text-sm animate-fade-in">
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
                ? "bg-purple-800 text-white"
                : "hover:text-white hover:bg-purple-600"
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