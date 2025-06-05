import React, { useState, useEffect, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import debounce from "lodash.debounce";

const InvoiceNewList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filteredInvoice, setFilteredInvoice] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          "https://billing-backend-seven.vercel.app/invoices/all"
        );
        const data = await response.json();
        setInvoices(data.data || []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredInvoice(invoices);
    } else {
      handleSearch(searchInput);
    }
  }, [searchInput, invoices]);

  const handleSearch = debounce((value) => {
    const lowerSearch = value.toLowerCase();
    const filtered = invoices.filter((invoice) => {
      const invoiceNumber = (invoice.invoiceNumber || "").toLowerCase();
      const customerName = (invoice.customerName || "").toLowerCase();
      const invoiceDate = invoice.invoiceDate
        ? new Date(invoice.invoiceDate).toISOString().split("T")[0]
        : "";
      const dueDate = invoice.dueDate
        ? new Date(invoice.dueDate).toISOString().split("T")[0]
        : "";
      return (
        invoiceNumber.includes(lowerSearch) ||
        customerName.includes(lowerSearch) ||
        invoiceDate.includes(lowerSearch) ||
        dueDate.includes(lowerSearch)
      );
    });
    setFilteredInvoice(filtered);
  }, 300);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilteredInvoice(invoices);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toISOString().split("T")[0];
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    try {
      await axios.delete(
        `https://billing-backend-seven.vercel.app/invoices/delete/${id}`
      );
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      toast.error("Error deleting invoice");
      console.error("Error deleting invoice:", error);
    }
  };
  const handleEdit = (id) => {
    navigate(`/InvoiceNewForm/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-60">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
        <p className="text-gray-600 text-lg">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-0">
        <h1 className="text-3xl font-extrabold text-purple-700">Invoices</h1>
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
          <Link to="/InvoiceNewForm">
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 px-5 rounded-lg shadow-lg transition duration-200">
              <FaPlus className="text-sm" />
              Create New Invoice
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-semibold">
            <tr>
              <th className="px-4 py-3 border-b">Invoice No</th>
              <th className="px-4 py-3 border-b">Customer</th>
              <th className="px-4 py-3 border-b">Date</th>
              <th className="px-4 py-3 border-b">Due Date</th>
              <th className="px-4 py-3 border-b">Amount</th>
              <th className="px-4 py-3 border-b">View</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredInvoice.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoice.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50 text-center">
                  <td className="px-4 py-3 border-b">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 border-b">{invoice.customerName}</td>
                  <td className="px-4 py-3 border-b">
                    {formatDate(invoice.invoiceDate)}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {invoice.amountDetails?.totalAmount ?? "N/A"}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <Link
                      to={`/InvoiceNewPrint/${invoice._id}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      View
                    </Link>
                  </td>
                  <td className="px-4 py-3 border-b space-x-2">
                    <button
                      onClick={() => handleEdit(invoice._id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(invoice._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
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
      <div className="sm:hidden grid grid-cols-1 mt-4 gap-4">
        {filteredInvoice.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No invoices found.</p>
        ) : (
          filteredInvoice.map((invoice) => (
            <div
              key={invoice._id}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-2 min-w-0">
                <div className="flex flex-col min-w-0">
                  <div className="font-semibold text-lg text-blue-700 truncate">
                    Invoice No: {invoice.invoiceNumber}
                  </div>
                  <div className="text-gray-500 text-sm break-all truncate">
                    {invoice.customerName}
                  </div>
                </div>
              </div>
              <div className="text-gray-700 text-sm mb-1 break-all">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(invoice.invoiceDate)}
              </div>
              <div className="text-gray-700 text-sm mb-1 break-all">
                <span className="font-semibold">Due Date:</span>{" "}
                {formatDate(invoice.dueDate)}
              </div>
              <div className="text-gray-700 text-sm mb-2 break-all">
                <span className="font-semibold">Amount:</span>{" "}
                <span className="text-green-700 font-bold">
                  {invoice.amountDetails?.totalAmount ?? "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  to={`/InvoiceNewPrint/${invoice._id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-base font-semibold text-white bg-green-500 shadow hover:bg-green-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" />
                  </svg>
                  View
                </Link>
                <button
                  onClick={() => handleEdit(invoice._id)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-base font-semibold text-white bg-blue-500 shadow hover:bg-blue-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(invoice._id)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-base font-semibold text-white bg-red-500 shadow hover:bg-red-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
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

export default memo(InvoiceNewList);
