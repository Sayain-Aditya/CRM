import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaPlus, FaSearch, FaTimes, FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
import debounce from "lodash.debounce";
import { Dialog } from '@headlessui/react';

const List = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredLeads(leads);
    } else {
      handleSearch(searchInput);
    }
  }, [searchInput, leads]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        "https://billing-backend-seven.vercel.app/lead/all"
      );
      const sortedLeads = (res.data.data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setLeads(sortedLeads);
      setFilteredLeads(sortedLeads);
    } catch (error) {
      toast.error("Failed to fetch leads");
    }
  };

  // Debounced search handler
  const handleSearch = debounce((value) => {
    const lowerSearch = value.toLowerCase();
    const filtered = leads.filter((lead) => {
      const name = (lead.name || "").toLowerCase();
      const phone = String(lead.phone || "");
      const email = (lead.email || "").toLowerCase();
      const enquiry = (lead.enquiry || "").toLowerCase();
      const followUpDate = lead.followUpDate
        ? new Date(lead.followUpDate).toLocaleDateString().toLowerCase()
        : "";

      return (
        name.includes(lowerSearch) ||
        phone.includes(lowerSearch) ||
        email.includes(lowerSearch) ||
        enquiry.includes(lowerSearch) ||
        followUpDate.includes(lowerSearch)
      );
    });
    setFilteredLeads(filtered);
  }, 300);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilteredLeads(leads);
  };

  const handleUpdate = async (id) => {
    navigate(`/LeadsForm/${id}`);
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
        await axios.delete(
          `https://billing-backend-seven.vercel.app/lead/delete/${deleteId}`
        );
        toast.success("Lead deleted successfully");
        fetchLeads();
      } catch (error) {
        toast.error("Failed to delete lead");
      }
      closeDeleteModal();
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-purple-50 to-white min-h-screen font-sans">
      <Toaster />
      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onClose={closeDeleteModal} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-sm mx-auto flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2 text-red-600 flex items-center gap-2">
              <FaTrash className="inline-block" /> Delete Lead?
            </h2>
          <p className="text-gray-600 mb-4 text-center">Are you sure you want to delete this lead? This action cannot be undone.</p>
          <div className="flex gap-4 w-full">
            <button onClick={closeDeleteModal} className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition">Delete</button>
          </div>
        </div>
      </Dialog>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-purple-700">
          Current Leads
        </h1>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by Name, Phone, Email, Enquiry or Follow-Up Date"
              value={searchInput}
              onChange={handleInputChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-200 focus:shadow-lg"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            {searchInput && (
              <FaTimes
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500 transition"
                onClick={clearSearch}
              />
            )}
          </div>
          <Link to="/LeadsForm">
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
          <thead className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-semibold sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Enquiry</th>
              <th className="px-6 py-4">Follow-Up</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredLeads.length === 0 ? (
             <tr>
             <td colSpan="7" className="text-center py-12 text-gray-500 bg-white rounded-b-xl shadow">
               <span className="mb-2">No invoices found.</span>
               <div className="flex flex-col items-center justify-center mt-2">
                 <Link to="/LeadsForm">
                   <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 px-4 rounded-lg shadow transition">
                     <FaPlus /> Create your Lead
                   </button>
                 </Link>
               </div>
             </td>
           </tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-purple-50'} hover:shadow-lg hover:scale-[1.01]`}
                >
                  <td className="px-6 py-4 flex items-center gap-3 cursor-pointer" onClick={() => handleUpdate(lead._id)} title="View/Update Lead">
                    <img
                      src={`https://i.pravatar.cc/40?u=${lead.email || lead.name || index}`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-purple-200"
                    />
                    <div className="font-medium">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{lead.enquiry}</td>
                  <td className="px-6 py-4">
                    {lead.followUpDate
                      ? new Date(lead.followUpDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold shadow transition-all duration-200 ${lead.status === true || lead.status === "true"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 border border-gray-300"}`}
                    >
                      {lead.status === true || lead.status === "true"
                        ? <><FaSpinner className="animate-spin mr-1" />In Progress</>
                        : <><FaRegTimesCircle className="text-red-400 mr-1" />Not Interested</>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(lead._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                        aria-label="Update Lead"
                        title="Update Lead"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(lead._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                        aria-label="Delete Lead"
                        title="Delete Lead"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden grid grid-cols-1 gap-4 mt-4">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center mt-10 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8zm0 0v2m0 4h.01" /></svg>
            <span className="mb-2">No leads available.</span>
            <Link to="/LeadsForm">
              <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 px-4 rounded-lg shadow transition">
                <FaPlus /> Add your first lead
              </button>
            </Link>
          </div>
        ) : (
          filteredLeads.map((lead, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={`https://i.pravatar.cc/40?u=${lead.email || lead.name || index}`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border border-purple-200"
                />
                <div>
                  <div className="text-lg font-bold text-purple-700 truncate">
                    {lead.name}
                  </div>
                  <div className="text-gray-500 text-sm truncate">
                    {lead.email}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 text-sm">
                <span className="font-semibold">Phone:</span> {lead.phone}
              </div>
              <div className="text-gray-700 text-sm">
                <span className="font-semibold">Enquiry:</span> {lead.enquiry}
              </div>
              <div className="text-gray-700 text-sm">
                <span className="font-semibold">Follow-Up:</span>{" "}
                {lead.followUpDate
                  ? new Date(lead.followUpDate).toLocaleDateString()
                  : "—"}
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold shadow transition-all duration-200 ${lead.status === true || lead.status === "true"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 border border-gray-300"}`}
                >
                  {lead.status === true || lead.status === "true"
                    ? <><FaSpinner className="animate-spin mr-1" />In Progress</>
                    : <><FaRegTimesCircle className="text-red-400 mr-1" />Not Interested</>}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleUpdate(lead._id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1"
                  aria-label="Update Lead"
                  title="Update Lead"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => openDeleteModal(lead._id)}
                  className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1"
                  aria-label="Delete Lead"
                  title="Delete Lead"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
