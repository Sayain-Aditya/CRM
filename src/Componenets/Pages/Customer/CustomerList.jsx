import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaPlus, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import debounce from "lodash.debounce";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredCustomer(customer);
    } else {
      handleSearch(searchInput);
    }
  }, [searchInput, customer]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        "https://billing-backend-wheat.vercel.app/customer/all"
      );
      const sortedCustomers = (res.data.data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setCustomer(sortedCustomers);
      setFilteredCustomer(sortedCustomers);
    } catch (error) {
      toast.error("Failed to fetch customers");
      console.error(error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const res = await axios.delete(
        `https://billing-backend-wheat.vercel.app/customer/delete/${id}`
      );
      if (res.status === 200) {
        toast.success("Customer deleted");
        fetchCustomers();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // Debounced search handler
  const handleSearch = debounce((value) => {
    const lowerSearch = value.toLowerCase();
    const filtered = customer.filter((customer) => {
      const name = (customer.name || "").toLowerCase();
      const phone = String(customer.phone || "");
      const email = (customer.email || "").toLowerCase();
      const address = (customer.Address || "").toLowerCase();
      return (
        name.includes(lowerSearch) ||
        phone.includes(lowerSearch) ||
        email.includes(lowerSearch) ||
        address.includes(lowerSearch)
      );
    });
    setFilteredCustomer(filtered);
  }, 300);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilteredCustomer(customer);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const res = await axios.delete(
          `https://billing-backend-wheat.vercel.app/customer/delete/${deleteId}`
        );
        if (res.status === 200) {
          toast.success("Customer deleted");
          fetchCustomers();
        }
      } catch (error) {
        toast.error("Failed to delete");
      }
      closeDeleteModal();
    }
  };

  return (
    <div className="p-4 md:p-6 font-sans">
      <Toaster />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-auto flex flex-col items-center">
          <h2 className="text-lg font-bold mb-2 text-red-600 flex items-center gap-2">
              <FaTrash className="inline-block" /> Delete Customer?
            </h2>
            <p className="text-gray-600 mb-4 text-center">Are you sure you want to delete this customer? This action cannot be undone.</p>
            <div className="flex gap-4 w-full">
              <button onClick={closeDeleteModal} className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-0">
         <h1 className="text-3xl font-extrabold text-purple-700">
          Current Customers
        </h1>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by Name, Phone, Email, or Address"
              value={searchInput}
              onChange={handleInputChange}
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
          <Link to="/CustomerForm">
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 px-5 rounded-lg shadow-lg transition duration-200">
              <FaPlus className="text-sm" />
              Add New
            </button>
          </Link>
        </div>
      </div>

      {/* Table for desktop */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-semibold sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredCustomer.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No details available.
                </td>
              </tr>
            ) : (
              filteredCustomer.map((customer, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?u=${
                        customer.email ||
                        customer.phone ||
                        customer.name ||
                        index
                      }`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="font-medium">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.Address}</td>
                  <td className="px-6 py-4 flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      onClick={() => navigate(`/CustomerForm/${customer._id}`)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => openDeleteModal(customer._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
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

      {/* Card view for mobile */}
      <div className="sm:hidden grid grid-cols-1 mt-4 gap-4">
        {filteredCustomer.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No details available.
          </p>
        ) : (
          filteredCustomer.map((customer, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2 min-w-0">
                <img
                  src={`https://i.pravatar.cc/40?u=${
                    customer.email || customer.phone || customer.name || index
                  }`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-lg text-purple-700 truncate">
                    {customer.name}
                  </div>
                  <div className="text-gray-500 text-sm break-all truncate">
                    {customer.email}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 text-sm mb-1 break-all">
                <span className="font-semibold">Phone:</span> {customer.phone}
              </div>
              <div className="text-gray-700 text-sm mb-2 break-all">
                <span className="font-semibold">Address:</span>{" "}
                {customer.Address}
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => navigate(`/CustomerForm/${customer._id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-lg text-sm font-semibold transition"
                >
                  Update
                </button>
                <button
                  onClick={() => openDeleteModal(customer._id)}
                  className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerList;
