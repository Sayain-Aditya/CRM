import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    carNumber: "",
    insurance: "",
    pollution: "",
    serviceReminder: "",
  });

  useEffect(() => {
    console.log("Car ID:", id);
    if (id) {
      axios
        .get(`https://billing-backend-wheat.vercel.app/car/mano/${id}`)
        .then((res) => {
          const { carNumber, insurance, pollution, serviceReminder } = res.data;
          setForm({
            carNumber: carNumber || "",
            insurance: insurance ? new Date(insurance).toISOString().slice(0, 16) : "",
            pollution: pollution ? new Date(pollution).toISOString().slice(0, 16) : "",
            serviceReminder: serviceReminder ? new Date(serviceReminder).toISOString().slice(0, 16) : "",
          });
        })
        .catch((err) => {
          toast.error("Failed to load car data");
          console.error("Error loading car data:", err);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.carNumber || !form.insurance || !form.pollution || !form.serviceReminder) {
      toast.error("All fields are required");
      return;
    }
    
    try {
      const payload = {
        carNumber: form.carNumber.trim(),
        insurance: new Date(form.insurance).toISOString(),
        pollution: new Date(form.pollution).toISOString(),
        serviceReminder: new Date(form.serviceReminder).toISOString(),
      };
      
      console.log("Payload being sent:", payload);

      let response;
      if (id) {
        response = await axios.put(
          `https://billing-backend-wheat.vercel.app/car/update/${id}`,
          payload
        );
        toast.success("Car updated successfully");
      } else {
        response = await axios.post(
          `https://billing-backend-wheat.vercel.app/car/add`,
          payload
        );
        toast.success("Car added successfully");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      navigate("/CarList");
    } catch (error) {
      console.error("Error submitting form:", error);
      console.error("Response data:", error.response?.data);
      toast.error("Failed to submit form");
    }
  };

  return (
    <div className="mx-auto p-4">
      <ToastContainer />
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
        </label>
        <input
          type="datetime-local"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
          name="insurance"
          value={form.insurance}
          onChange={handleChange}
        />
        <label className="block mb-2 font-semibold">
          Pollution Expire Date
        </label>
        <input
          type="datetime-local"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
          name="pollution"
          value={form.pollution}
          onChange={handleChange}
        />
        <label className="block mb-2 font-semibold">
          Service Reminder Date
        </label>
        <input
          type="datetime-local"
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
          name="serviceReminder"
          value={form.serviceReminder}
          onChange={handleChange}
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
        </div>
      </form>
    </div>
  );
};

export default CarForm;