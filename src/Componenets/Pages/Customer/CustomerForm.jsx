import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const CustomerForm = () => {
  const { id } = useParams(); // Get the id from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    Address: "",
    WhatsApp: "",
  });

  useEffect(() => {
    if (id) {
      // Fetch existing customer data to edit
      axios
        .get(`https://billing-backend-seven.vercel.app/customer/mono/${id}`)
        .then((res) => {
          const { name, phone, email, Address, WhatsApp } = res.data.data;
          setFormData({
            name: name || "",
            phone: phone || "",
            email: email || "",
            Address: Address || "",
            WhatsApp: WhatsApp || "",
          });
        })
        .catch((err) => {
          toast.error("Failed to load customer data");
          console.error(err);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update
        await axios.put(
          `https://billing-backend-seven.vercel.app/customer/update/${id}`,
          formData
        );
        toast.success("Customer updated successfully");
      } else {
        // Add new
        await axios.post(
          "https://billing-backend-seven.vercel.app/customer/add",
          formData
        );
        toast.success("Customer added successfully");
      }

      navigate("/CustomerList"); // or wherever your list is
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center  from-blue-50 to-white py-8 px-2 my-[-30px]">
      <div className="w-full bg-white rounded-2xl shadow-2xl border border-gray-300 p-6 sm:p-10">
        <Toaster position="top-right" reverseOrder={false} />
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-700 tracking-wide">
          {id ? "Update Customer" : "Add New Customer"}
        </h2>
        <hr className="mb-6 border-gray-200" />
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
          {/* Name & Primary Number */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Customer Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Primary Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email & Address */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Address</label>
              <input
                type="text"
                name="Address"
                placeholder="Full address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block mb-2 font-semibold">WhatsApp Number</label>
            <input
              type="tel"
              name="WhatsApp"
              placeholder="Optional number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={formData.WhatsApp}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              disabled={
                !formData.name ||
                !formData.phone ||
                !formData.Address ||
                !formData.email
              }
              type="submit"
              className="w-full sm:w-auto px-10 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md"
            >
              {id ? "Update" : "Submit"} Detail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
