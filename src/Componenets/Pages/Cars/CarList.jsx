import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import debounce from "lodash.debounce";

const CarList = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get(`https://billing-backend-seven.vercel.app/car/all`); // Ensure the Promise is awaited
      console.log("Full API Response:", res); // Log the full response
      const cars = res.data?.data || []; // Access the data field in the response
      console.log("Cars fetched successfully:", cars); // Log the fetched cars
      setCars(cars); // Update the state with the fetched cars
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    }
  };
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredCars(cars);
    } else {
      handleSearch(searchInput);
    }
  }, [searchInput, cars]);

  const handleSearch = debounce((value) => {
    const lowerSearch = value.toLowerCase();
    const filtered = cars.filter((car) => {
      const name = (car.carNumber || "").toLowerCase();
      return name.includes(lowerSearch);
    });
    setFilteredCars(filtered);
  }, 300);

  const handleInputChnage = (e) => {
    setSearchInput(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilteredCars(cars);
  };

  const handleDelete = async (id) => {
    console.log("Deleting car with id:", id); // Log the id
    try {
      const res = await axios.delete(`https://billing-backend-seven.vercel.app/car/delete/${id}`);
      console.log("Delete response:", res);
      fetchCars(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete car:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-purple-700">Saved Cars</h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by Car Number"
              value={searchInput}
              onChange={handleInputChnage}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            {searchInput && (
              <FaTimes
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={clearSearch}
              />
            )}
          </div>
          <Link to="/CarForm">
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 px-5 rounded-lg shadow-lg transition duration-200">
              <FaPlus className="text-sm" />
              Add New Car
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-semibold">
            <tr>
              <th className="px-6 py-4">Car Number</th>
              <th className="px-6 py-4">Insurance</th>
              <th className="px-6 py-4">Pollution</th>
              <th className="px-6 py-4">Service Reminder</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredCars.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No cars saved yet.
                </td>
              </tr>
            ) : (
              filteredCars.map((car, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 border-t border-gray-200 transition-all duration-200"
                >
                  <td className="px-6 py-4">{car.carNumber}</td>
                  <td className="px-6 py-4">
                    {new Date(car.insurance).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(car.pollution).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(car.serviceReminder).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/CarForm/${car._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden grid grid-cols-1 gap-4 mt-4">
        {filteredCars.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No cars saved yet.</p>
        ) : (
          filteredCars.map((car, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 transition-transform hover:scale-[1.02]"
            >
              <div className="text-xl font-bold text-purple-700 mb-2">
                <div className="text-lg font-bold text-purple-700 truncate">
                  {car.carNumber}
                </div>
              </div>
              <div className="text-gray-700 text-sm">
                <span className="font-semibold">Insurance:</span>{" "}
                {car.insurance}
              </div>
              <div className="text-gray-700 text-sm">
                <span className="font-semibold">Pollution:</span>{" "}
                {car.pollution}
              </div>
              <div className="text-gray-700 text-sm">
                <span className="font-semibold">Service Reminder:</span>{" "}
                {car.serviceReminder}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => handleDelete(car._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/CarForm/${car._id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default CarList;
