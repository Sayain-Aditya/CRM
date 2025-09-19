import { useState, useEffect } from "react";
import {
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  CameraIcon,
  Bars3Icon,
  IdentificationIcon,
  UserCircleIcon,
  CalculatorIcon,
  QueueListIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ collapsed: externalCollapsed, setCollapsed: setExternalCollapsed }) => {
  const [openProducts, setOpenProducts] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [selected, setSelected] = useState("");
  const [collapsed, setCollapsed] = useState(externalCollapsed || false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Sync with external collapsed state
  useEffect(() => {
    if (externalCollapsed !== undefined) {
      setCollapsed(externalCollapsed);
    }
  }, [externalCollapsed]);

  const handleItemClick = (title) => {
    setSelected(title);
    if (collapsed) setCollapsed(false);
    if (mobileOpen) setMobileOpen(false);
  };

  const handleGalleryClick = () => {
    if (collapsed) {
      setCollapsed(false);
    }
    setOpenGallery(!openGallery);
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ clear user
    navigate("/"); // ✅ redirect to login
  };

  const sidebarContent = (
    <div
      className={`bg-gradient-to-b from-slate-800 to-slate-900 h-full flex flex-col transition-all duration-300 ease-in-out shadow-xl no-print ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center border-b border-slate-700 ${
        collapsed ? "justify-center p-4" : "gap-3 p-6"
      }`}>
        <img 
          src="/icon.png" 
          alt="Logo" 
          className={`rounded-lg ${
            collapsed ? "w-8 h-8" : "w-10 h-10"
          }`} 
        />
        {!collapsed && (
          <h1 className="text-lg font-semibold text-white">
            Shine Infosolution
          </h1>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-2">
        <SidebarItem
          title="Dashboard"
          icon={<Squares2X2Icon className="w-5 h-5" />}
          to="/Dashboard"
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

        <SidebarDropdown
          title="Gallery"
          icon={<CameraIcon className="w-5 h-5" />}
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
          icon={<CalculatorIcon className="w-5 h-5" />}
          to="/InvoiceNewList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="Iternary"
          icon={<AdjustmentsHorizontalIcon className="w-5 h-5" />}
          to="/IternaryTable"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
        <SidebarItem
          title="CarList"
          icon={<QueueListIcon className="w-5 h-5" />}
          to="/CarList"
          selected={selected}
          setSelected={handleItemClick}
          collapsed={collapsed}
        />
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Hamburger for mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="no-print fixed top-4 left-4 z-50 bg-slate-800 rounded-lg p-2.5 md:hidden shadow-lg hover:bg-slate-700 transition-colors"
      >
        <Bars3Icon className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar for desktop */}
      <div className="no-print hidden md:block relative">
        {sidebarContent}
        {/* Collapse Toggle Button */}
        <button
          onClick={() => {
            const newCollapsed = !collapsed;
            setCollapsed(newCollapsed);
            if (setExternalCollapsed) {
              setExternalCollapsed(newCollapsed);
            }
          }}
          className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white border border-slate-300 rounded-full p-1.5 shadow-lg hover:bg-slate-50 transition-colors z-50"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>

      {/* Sidebar for mobile with overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="no-print fixed top-0 left-0 w-64 h-full z-40 shadow-xl md:hidden">
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
    className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
      selected === title
        ? "text-white shadow-lg" 
        : "text-slate-300 hover:text-white hover:bg-slate-700"
    } ${collapsed ? "justify-center" : ""}`}
    style={{
      backgroundColor: selected === title ? 'rgb(126, 34, 206)' : 'transparent'
    }}
  >
    <div className="w-5 h-5">{icon}</div>
    {!collapsed && <span className="text-sm font-medium">{title}</span>}

    {collapsed && (
      <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50">
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
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 ${
        items.some(item => selected === item.title)
          ? "text-white"
          : "text-slate-300 hover:text-white hover:bg-slate-700"
      } ${collapsed ? "justify-center" : ""}`}
      style={{
        backgroundColor: items.some(item => selected === item.title) ? 'rgb(126, 34, 206)' : 'transparent'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-5 h-5">{icon}</div>
        {!collapsed && <span className="text-sm font-medium">{title}</span>}
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
      <div className="ml-6 mt-1 space-y-1">
        {items.map((item, idx) => (
          <Link
            to={item.link}
            key={idx}
            onClick={() => {
              setSelected(item.title);
              setIsOpen(false);
              if (setMobileOpen) setMobileOpen(false);
            }}
            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
              selected === item.title
                ? "text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-600"
            }`}
            style={{
              backgroundColor: selected === item.title ? 'rgb(126, 34, 206)' : 'transparent'
            }}
          >
            {item.title}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
