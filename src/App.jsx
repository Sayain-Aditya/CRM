import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
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
import {
  generateToken,
  messaging,
  registerServiceWorker,
} from "./Notification/firebasse";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const navigate = useNavigate();
  // const [leads, setLeads] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [customer, setCustomer] = useState([]);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("loggedin");
    if (userLoggedIn) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    async function setupFCM() {
      try {
        await registerServiceWorker(); // Make sure this is defined and correct
        const token = await generateToken();
        if (token) {
          console.log("Send this token to backend:", token);
          localStorage.setItem("fcmToken", token); // Optional but useful for access later
          // You can send it to backend here if needed
          // await axios.post("/save-token", { token });
        }
      } catch (error) {
        console.error("FCM setup failed:", error);
      }
    }

    setupFCM();
  }, []);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground FCM message received:", payload);
      toast.success(
        `${payload.notification.title}: ${payload.notification.body}`
      );
    });

    // Optional: return unsubscribe function in case of cleanup
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Protected Layout Route */}
      {isAuthenticated ? (
        <div className="flex h-screen">
          {/* Sidebar Layout */}
          <div className="min-h-screen bg-white shadow-md">
            <Layout />
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
              <Route path="leadsform" element={<LeadsForm />} />
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
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
