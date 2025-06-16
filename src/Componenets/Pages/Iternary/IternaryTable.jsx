import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import debounce from "lodash.debounce";

const IternaryTable = () => {
  const navigate = useNavigate();
  const [iternaries, setIternaries] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredIternaries, setFilteredIternaries] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [iternaryToDelete, setIternaryToDelete] = useState(null);
  const debouncedSearch = useRef(
    debounce((value, data) => {
      const lowerSearch = value.toLowerCase();
      const filtered = data.filter((iternaries) => {
        const title = (iternaries.title || "").toLowerCase();
        const cost = String(iternaries.cost || "").toLowerCase();
        const date = iternaries.date
          ? new Date(iternaries.date).toLocaleDateString().toLowerCase()
          : "";
        return (
          title.includes(lowerSearch) ||
          cost.includes(lowerSearch) ||
          date.includes(lowerSearch)
        );
      });
      setFilteredIternaries(filtered);
    }, 300)
  ).current;

  useEffect(() => {
    fetchIternaries();
  }, []);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredIternaries(iternaries);
    } else {
      debouncedSearch(searchInput, iternaries);
    }
    return () => debouncedSearch.cancel();
  }, [searchInput, iternaries, debouncedSearch]);

  const fetchIternaries = async () => {
    try {
      const res = await axios.get(
        "https://billing-backend-seven.vercel.app/Iternary/all"
      );
      const sortedIternaries = (res.data.data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setIternaries(sortedIternaries);
      setFilteredIternaries(sortedIternaries);
    } catch (error) {
      toast.error("Failed to fetch itineraries");
    }
  };

  const clearSearch = () => setSearchInput("");
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://billing-backend-seven.vercel.app/Iternary/delete/${id}`
      );
      toast.success("Itinerary deleted successfully!");
      setIternaries((prev) => prev.filter((iternaries) => iternaries._id !== id));
      setFilteredIternaries((prev) =>
        prev.filter((iternaries) => iternaries._id !== id)
      );
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      toast.error("Failed to delete itinerary.");
    }
  };
  const handleUpdate = (id) => {
    navigate(`/IternaryList/${id}`); // Ensure the correct id is passed to the form page
  }

  const handleView = (id) => {
    // Navigate to the view page with the itinerary ID
    navigate(`/IternaryField/${id}`);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <Toaster />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-purple-700">
          Itinerary List
        </h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by Title, Cost, or Date"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchInput && (
              <FaTimes
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={clearSearch}
              />
            )}
          </div>
          <Link to="/IternaryList">
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 px-5 rounded-lg shadow-lg transition duration-200">
              <FaPlus className="text-sm" />
              Add New
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-semibold">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Cost</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Advance</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filteredIternaries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No itineraries found.
                </td>
              </tr>
            ) : (
              filteredIternaries.map((iternaries, index) => (
                <tr
                  key={index}
                  className="hover:bg-purple-50 border-t border-gray-200 transition-all"
                >
                  <td className="px-6 py-4 font-semibold">
                    {iternaries.title || "—"}
                  </td>
                  <td className="px-6 py-4">₹ {iternaries.cost || "—"}</td>
                  <td className="px-6 py-4">
                    {iternaries.date
                      ? new Date(iternaries.date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">₹ {iternaries.advance || "—"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleView(iternaries._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/IternaryList/${iternaries._id}`)
                      }
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIternaryToDelete(iternaries._id);
                        setShowDeleteModal(true);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
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
        {filteredIternaries.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No itineraries available.
          </p>
        ) : (
          filteredIternaries.map((iternaries, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 transition-transform hover:scale-[1.02]"
            >
              <div className="text-xl font-bold text-purple-700 mb-2">
                {iternaries.title || "—"}
              </div>
              <div className="text-gray-700 text-sm mb-1">
                <span className="font-medium">Date:</span>{" "}
                {iternaries.date
                  ? new Date(iternaries.date).toLocaleDateString()
                  : "—"}
              </div>
              <div className="text-gray-700 text-sm mb-1">
                <span className="font-medium">Cost:</span> ₹
                {iternaries.cost || "—"}
              </div>
              <div className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Advance:</span> ₹
                {iternaries.advance || "—"}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleView(iternaries._id)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View
                </button>
                <button
                 onClick={() =>
                    navigate(`/IternaryList/${iternaries._id}`)
                  }
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setIternaryToDelete(iternaries._id);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-auto flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2 text-red-600 flex items-center gap-2">
              <FaTrash className="inline-block" /> Delete Itinerary?
            </h2>
            <p className="text-gray-600 mb-4 text-center">Are you sure you want to delete this itinerary? This action cannot be undone.</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(iternaryToDelete);
                  setShowDeleteModal(false);
                  setIternaryToDelete(null);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IternaryTable;