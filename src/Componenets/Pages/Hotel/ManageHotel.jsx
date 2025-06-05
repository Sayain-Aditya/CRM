import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ManageHotel = () => {
  const [name, setName] = useState("");
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleAddHotel = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Hotel name cannot be empty!");
      return;
    }

    try {
      const res = await axios.post(
        "https://billing-backend-seven.vercel.app/add",
        {
          name: name.trim(),
        }
      );

      if (res.status === 201) {
        toast.success("Hotel added successfully!");
        setName("");
        fetchHotels(); // refresh the list
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Hotel already exists");
      } else {
        toast.error("Server error");
      }
    }
  };
  // Fetch hotels from backend
  const fetchHotels = async () => {
    try {
      const res = await axios.get(
        "https://billing-backend-seven.vercel.app/hotels"
      );
      setHotels(res.data); // adjust if your data shape is different
    } catch (err) {
      toast.error("Failed to fetch hotels");
    }
  };
  const deleteHotel = async (id) => {
    try {
      const res = await axios.delete(
        `https://billing-backend-seven.vercel.app/hotels/${id}`
      );
      if (res.status === 200) {
        toast.success("Hotel deleted successfully!");
        fetchHotels(); // refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete hotel");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <Toaster />

      {/* Header & Add Image Button */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 max-w-6xl mx-auto">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 drop-shadow-lg">
            Add Hotels
          </h1>
          <p className="text-gray-600 mt-2 text-md md:text-lg">
            Manage your hotel listings effortlessly
          </p>
        </div>
        <a
          href="/AddImages"
          className="mt-4 cursor-pointer md:mt-0 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition duration-300 shadow-lg"
        >
          + Add Image
        </a>
      </div>

      {/* Form Card */}
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <form onSubmit={handleAddHotel}>
          <div className="mb-6">
            <label
              htmlFor="DestinationName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Hotel Name
            </label>
            <input
              type="text"
              id="DestinationName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the hotel name"
              required
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Add Hotel
          </button>
        </form>
      </div>

      {/* Hotel List */}
      <div className="mt-12 mx-auto">
        <div className="overflow-hidden shadow-lg rounded-lg">
          {/* Desktop Table */}
          <div className="hidden sm:block">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-300 text-black uppercase text-sm">
                  <th className="px-6 py-3 text-left">Sr. No.</th>
                  <th className="px-6 py-3 text-left">Hotel Name</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {hotels.length > 0 ? (
                  hotels.map((hotel, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition duration-200"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{hotel.name}</td>
                      <td className="py-3 px-6">
                        <button
                          onClick={() => deleteHotel(hotel._id)}
                          className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No hotels added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}

          <div className="sm:hidden grid grid-cols-1 gap-6">
            {hotels.length > 0 ? (
              hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-indigo-50 to-white rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-indigo-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-indigo-700 truncate">
                      {hotel.name}
                    </h3>
                    <span className="text-sm font-medium text-black">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteHotel(hotel._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg font-semibold shadow-md transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">
                No hotels added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHotel;
