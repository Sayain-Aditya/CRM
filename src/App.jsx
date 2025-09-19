import {
  Routes,
  Route,
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
import DestinationImages from "./Componenets/Pages/Destinations/DestinationImages";
import CustomerList from "./Componenets/Pages/Customer/CustomerList";
import CustomerForm from "./Componenets/Pages/Customer/CustomerForm";
import InvoiceNewList from "./Componenets/Pages/Invoice/InvoiceNewList";
import InvoiceNewForm from "./Componenets/Pages/Invoice/InvoiceNewForm";
import InvoiceNewPrint from "./Componenets/Pages/Invoice/InvoiceNewPrint";
import IternaryList from "./Componenets/Pages/Iternary/IternaryList";
import IternaryField from "./Componenets/Pages/Iternary/IternaryField";
import IternaryTable from "./Componenets/Pages/Iternary/IternaryTable";
import { registerFCM, listenToMessages } from "./utils/registerFCM"; // ✅ added
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react"; // ✅ useEffect added
import "animate.css";
import CarList from "./Componenets/Pages/Cars/CarList";
import CarForm from "./Componenets/Pages/Cars/CarForm";
import AuthPage from "./Componenets/Pages/auth/auth";
import ProtectedRoute from "./Componenets/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/";

  useEffect(() => {
    // ✅ Firebase push notification setup
    registerFCM();
    listenToMessages();
  }, []);

  return (
    <>
      <ToastContainer />
      
      {isAuthPage ? (
        <Routes>
          <Route path="/" element={<AuthPage />} />
        </Routes>
      ) : (
        <div className="flex h-screen">
          <div className="min-h-screen bg-white shadow-md">
            <Layout />
          </div>

          <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><Product /></ProtectedRoute>} />
              <Route path="/common" element={<ProtectedRoute><Images /></ProtectedRoute>} />
              <Route path="/hotel" element={<ProtectedRoute><ManageHotel /></ProtectedRoute>} />
              <Route path="/addimages" element={<ProtectedRoute><AddImage /></ProtectedRoute>} />
              <Route path="/destination" element={<ProtectedRoute><Destination /></ProtectedRoute>} />
              <Route path="/DestinationImages" element={<ProtectedRoute><DestinationImages /></ProtectedRoute>} />
              <Route path="/list" element={<ProtectedRoute><List /></ProtectedRoute>} />
              <Route path="/Leadsform" element={<ProtectedRoute><LeadsForm /></ProtectedRoute>} />
              <Route path="/Leadsform/:id" element={<ProtectedRoute><LeadsForm /></ProtectedRoute>} />
              <Route path="/CustomerList" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
              <Route path="/CustomerForm" element={<ProtectedRoute><CustomerForm /></ProtectedRoute>} />
              <Route path="/CustomerForm/:id" element={<ProtectedRoute><CustomerForm /></ProtectedRoute>} />
              <Route path="/InvoiceNewList" element={<ProtectedRoute><InvoiceNewList /></ProtectedRoute>} />
              <Route path="/InvoiceNewForm/:id" element={<ProtectedRoute><InvoiceNewForm /></ProtectedRoute>} />
              <Route path="/InvoiceNewForm" element={<ProtectedRoute><InvoiceNewForm /></ProtectedRoute>} />
              <Route path="/InvoiceNewPrint/:id" element={<ProtectedRoute><InvoiceNewPrint /></ProtectedRoute>} />
              <Route path="/IternaryList" element={<ProtectedRoute><IternaryList /></ProtectedRoute>} />
              <Route path="/IternaryList/:id" element={<ProtectedRoute><IternaryList /></ProtectedRoute>} />
              <Route path="/IternaryField/" element={<ProtectedRoute><IternaryField /></ProtectedRoute>} />
              <Route path="/IternaryField/:id" element={<ProtectedRoute><IternaryField /></ProtectedRoute>} />
              <Route path="/IternaryTable" element={<ProtectedRoute><IternaryTable /></ProtectedRoute>} />
              <Route path="/CarList" element={<ProtectedRoute><CarList /></ProtectedRoute>} />
              <Route path="/CarForm" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
              <Route path="/CarForm/:id" element={<ProtectedRoute><CarForm /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
