import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import { CarContext } from "./CarContext";
import { requestNotificationPermission } from "../../../services/notificationService";

async function getPushSubscription() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  }
  return null;
}

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { addCar } = useContext(CarContext);

  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    carNumber: "",
    insurance: "",
    pollution: "",
    serviceReminder: "",
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Load saved cars once on mount
useEffect(() => {
  console.log("Car ID:", id); // Log the id
  if (id) {
    axios
      .get(`https://billing-backend-seven.vercel.app/car/mano/${id}`)
      .then((res) => {
        const { carNumber, insurance, pollution, serviceReminder } = res.data;
        setForm({
          carNumber: carNumber || "",
          insurance: insurance || "",
          pollution: pollution || "",
          serviceReminder: serviceReminder || "",
        });
      })
      .catch((err) => {
        toast.error("Failed to load car data");
        console.error("Error loading car data:", err);
      });
  }
}, [id]);

  useEffect(() => {
    const checkNotificationStatus = async () => {
      const permission = await requestNotificationPermission();
      setNotificationsEnabled(permission);
    };
    checkNotificationStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const subscription = await getPushSubscription();

    const insuranceDateUTC = new Date(form.insurance).toISOString();
    const pollutionDateUTC = new Date(form.pollution).toISOString();
    const serviceReminderDateUTC = new Date(form.serviceReminder).toISOString();
    const payload = {
      ...form,
      insurance: insuranceDateUTC,
      pollution: pollutionDateUTC,
      serviceReminder: serviceReminderDateUTC,
      subscription,
    };
    let response;
    if (id) {
      response = await axios.put(
      `https://billing-backend-seven.vercel.app/car/update/${id}`,
        payload
      );
      toast.success("Car updated successfully");
    } else {
      response = await axios.post(
       `https://billing-backend-seven.vercel.app/car/add`,
        payload
      );
      toast.success("Car added successfully");
    }

    navigate("/CarList");
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Failed to submit form");
  }
};

  const testNotification = () => {
    if (notificationsEnabled) {
      toast.info("Test notification would appear here (scheduling removed)");
    } else {
      toast.warning("Please enable notifications first");
    }
  };

  return (
    <div className="mx-auto p-4">
       <ToastContainer position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">Car Information</h1>
      <form className="space-y-4 bg-white p-4 rounded shadow">
        <input
          className="w-full border p-2 rounded"
          name="carNumber"
          placeholder="Enter Car Number"
          value={form.carNumber}
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-semibold">
          Insurance Expire Date
          {notificationsEnabled ? (
            <span className="text-green-500 ml-2 text-sm">
              🔔 Notifications enabled
            </span>
          ) : (
            <span className="text-yellow-500 ml-2 text-sm">
              🔕 Notifications disabled
            </span>
          )}
        </label>
        <input
          type="datetime-local"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
          name="insurance"
          value={form.insurance}
          onChange={handleChange}
          placeholder="Insurance Expiry Date"
        />
        <input
          type="datetime-local"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
          name="pollution"
          value={form.pollution}
          onChange={handleChange}
          placeholder="Pollution Expiry Date"
        />
        <input
          type="datetime-local"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
          name="serviceReminder"
          value={form.serviceReminder}
          onChange={handleChange}
          placeholder="Service Reminder Date"
        />
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-2 px-5 rounded-lg"
            type="submit"
          >
            <FaPlus className="text-sm" />
            {id ? "Update" : "Submit"} Car
          </button>
          <button
            type="button"
            onClick={testNotification}
            className="ml-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Test Notification
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
