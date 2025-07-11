import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import DashBoard from "./Componenets/Pages/DashBoard";
import Product from "./Componenets/Pages/Products";
import Layout from "./Componenets/Layout";
import Images from "./Componenets/Pages/Img/Images";
import ManageHotel from "./Componenets/Pages/Hotel/ManageHotel";
import AddImage from "./Componenets/Pages/Hotel/AddImage";
import Destination from "./Componenets/Pages/Destinations/Destination";
import List from "./Componenets/Pages/Leads/List";
import LeadsForm from "./Componenets/Pages/Leads/LeadsForm";
import { useEffect, useState } from "react";
import LoginPage from "./Login/LoginPage";
import DestinationImages from "./Componenets/Pages/Destinations/DestinationImages";
import CustomerList from "./Componenets/Pages/Customer/CustomerList";
import CustomerForm from "./Componenets/Pages/Customer/CustomerForm";
import InvoiceNewList from "./Componenets/Pages/Invoice/InvoiceNewList";
import InvoiceNewForm from "./Componenets/Pages/Invoice/InvoiceNewForm";
import InvoiceNewPrint from "./Componenets/Pages/Invoice/InvoiceNewPrint";
import IternaryList from "./Componenets/Pages/Iternary/IternaryList";
import IternaryField from "./Componenets/Pages/Iternary/IternaryField";
import IternaryTable from "./Componenets/Pages/Iternary/IternaryTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import "animate.css";
import CarList from "./Componenets/Pages/Cars/CarList";
import CarForm from "./Componenets/Pages/Cars/CarForm";
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Register from "./Login/Register";
import { AuthProvider, useAuth } from './Context/authContext';

async function subscribeUser() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey:
      "BJe_vtNqtLr7GTOmVzXPM1r1viWvfsLUyPe-VUIIEaDUhA-zlHk-86NNxonVrHVTusWPdAoNfhlwEn6ZTDnyO9A", // Replace with your VAPID public key (base64)
  });
  // Send `subscription` to your backend to save it
  await fetch("https://billing-backend-seven.vercel.app/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check subscription status on mount
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const handleEnableNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribeUser();
      setIsSubscribed(true); // Hide the button after subscribing
      alert("Push notifications enabled!");
    } else {
      alert("Notifications permission denied.");
    }
  };

  return (
    <>
      {/* Only show the button if not already subscribed */}
      {!isSubscribed && (
        <button
          onClick={handleEnableNotifications}
          style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
        >
          Enable Push Notifications
        </button>
      )}
      <ToastContainer />
      {console.log('App render - isAuthenticated:', user)}
      
      {user ? (
        <div className="flex h-screen">
          {/* Sidebar Layout */}
          <div className="min-h-screen bg-white shadow-md">
            <Layout onLogout={handleLogout} user={user} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
            <Routes>
              <Route path="dashboard" element={<DashBoard />} />
              <Route path="products" element={<Product />} />
              <Route path="common" element={<Images />} />
              <Route path="hotel" element={<ManageHotel />} />
              <Route path="addimages" element={<AddImage />} />
              <Route path="destination" element={<Destination />} />
              <Route path="DestinationImages" element={<DestinationImages />} />
              <Route path="list" element={<List />} />
              
              <Route path="Leadsform" element={<LeadsForm />} />
               <Route path="Leadsform/:id" element={<LeadsForm />} />

              <Route path="CustomerList" element={<CustomerList />} />
              <Route path="CustomerForm" element={<CustomerForm />} />
              <Route path="CustomerForm/:id" element={<CustomerForm />} />
              <Route path="InvoiceNewList" element={<InvoiceNewList />} />
              <Route path="InvoiceNewForm/:id" element={<InvoiceNewForm />} />
              <Route path="InvoiceNewForm" element={<InvoiceNewForm />} />
              <Route path="InvoiceNewPrint/:id" element={<InvoiceNewPrint />} />
              <Route path="IternaryList" element={<IternaryList />} />
              <Route path="IternaryList/:id" element={<IternaryList />} />
              <Route path="IternaryField/" element={<IternaryField />} />
              <Route path="IternaryField/:id" element={<IternaryField />} />
              <Route path="IternaryTable" element={<IternaryTable />} />
              <Route path="CarList" element={<CarList />} />
              <Route path="CarForm" element={<CarForm />} />
                  <Route path="CarForm/:id" element={<CarForm />} />
            </Routes>
            
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/Dashboard" replace />} />
        </Routes>
      )}
    </>
  );
}

// Wrap your app with AuthProvider
export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
