import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import debounce from "lodash.debounce";

const List = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);

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
      setLeads(res.data.data || []);
      setFilteredLeads(res.data.data || []);
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

  return (
    <div className="p-6 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <Toaster />
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
          <thead className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Enquiry</th>
              <th className="px-6 py-4">Follow-Up</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No leads available.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 border-t border-gray-200 transition-all duration-200"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?u=${
                        lead.email || lead.name || index
                      }`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
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
                      className={`text-xs px-3 py-1 rounded-full font-semibold shadow ${
                        lead.status === "true"
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {lead.status === "true"
                        ? "In Progress"
                        : "Not Interested"}
                    </span>
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
          <p className="text-center text-gray-500 mt-10">No leads available.</p>
        ) : (
          filteredLeads.map((lead, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 transition-transform hover:scale-[1.02]"
            >
              <div className="text-xl font-bold text-purple-700 mb-2">
                <img
                  src={`https://i.pravatar.cc/40?u=${
                    lead.email || lead.name || index
                  }`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover"
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
                  className={`text-xs px-3 py-1 rounded-full font-semibold shadow ${
                    lead.status === "true"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {lead.status === "true" ? "In Progress" : "Not Interested"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
