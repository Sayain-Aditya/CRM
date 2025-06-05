import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const InvoiceNewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerGST: "",
    invoiceDate: "",
    dueDate: "",
    customerName: "",
    invoiceNumber: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    dispatchThrough: "",
    customerAadhar: "",
    productDetails: [],
    amountDetails: {
      gstPercentage: "",
      discountOnTotal: "",
      totalAmount: "",
    },
  });

  const [rows, setRows] = useState([
    {
      description: "",
      unit: "",
      quantity: "",
      price: "",
      discount: "",
      amount: "",
    },
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        description: "",
        unit: "",
        quantity: "",
        price: "",
        discount: "",
        amount: "",
      },
    ]);
  };
  useEffect(() => {
    if (id) {
      const fetchInvoice = async () => {
        try {
          const response = await axios.get(
            `https://billing-backend-seven.vercel.app/invoices/mono/${id}`
          );
          setFormData({
            ...response.data.data,
            productDetails: response.data.data.productDetails || [],
          });

          // Set rows
          const rows = response.data.data.productDetails.map((product) => ({
            description: product.description,
            unit: product.unit,
            quantity: product.quantity,
            price: product.price,
            discount: product.discountPercentage,
            amount: product.amount,
            invoiceNumber: product.invoiceNumber,
          }));

          setRows(rows);
        } catch (error) {
          toast.error("Error fetching invoice details for editing.");
        }
      };

      fetchInvoice();
    }
  }, [id]);
  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    }
  };

  const handleInputChange = (e, index, field) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = e.target.value;
    setRows(updatedRows);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiscountChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedAmountDetails = {
        ...prev.amountDetails,
        [name]: value,
      };

      // Calculate the sum of all product amounts
      const baseAmount = rows.reduce(
        (sum, row) => sum + (parseFloat(row.amount) || 0),
        0
      );

      // Calculate GST and discount
      const gstPercentage = parseFloat(updatedAmountDetails.gstPercentage) || 0;
      const discountOnTotal =
        parseFloat(updatedAmountDetails.discountOnTotal) || 0;

      // Calculate total amount
      const totalAmount =
        baseAmount * (1 + gstPercentage / 100) - discountOnTotal;

      return {
        ...prev,
        amountDetails: {
          ...updatedAmountDetails,
          totalAmount: totalAmount.toFixed(2), // Update total amount
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productDetails = rows.map((row) => ({
      description: row.description,
      unit: row.unit,
      quantity: parseFloat(row.quantity) || 0,
      price: parseFloat(row.price) || 0,
      discountPercentage: parseFloat(row.discount) || 0,
      amount: parseFloat(row.amount) || 0,
    }));

    const payload = {
      ...formData,
      productDetails, // ensure the correct format for productDetails
    };

    try {
      if (id) {
        // Update the invoice using PUT request
        await axios.put(
          `https://billing-backend-seven.vercel.app/invoices/update/${id}`,
          payload
        );
        toast.success("Invoice updated successfully!");
      } else {
        // Create a new invoice
        await axios.post(
          "https://billing-backend-seven.vercel.app/invoices/create",
          payload
        );
        toast.success("Invoice created successfully!");
      }

      // Reset form
      setFormData({
        customerGST: "",
        invoiceDate: "",
        dueDate: "",
        customerName: "",
        invoiceNumber: "",
        customerAddress: "",
        customerPhone: "",
        customerEmail: "",
        dispatchThrough: "",
        customerAadhar: "",
        productDetails: [],
        amountDetails: {
          gstPercentage: "",
          discountOnTotal: "",
          totalAmount: "",
        },
      });

      setRows([
        {
          description: "",
          unit: "",
          quantity: "",
          price: "",
          discount: "",
          amount: "",
        },
      ]);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error submitting the form");
    }

    setTimeout(() => {
      navigate("/InvoiceNewList"); // Navigate after submission
    }, 2000);
  };

  const [productOptions, setProductOptions] = useState([]);

  // Fetch all product names on component mount
  useEffect(() => {
    axios
      .get("https://billing-backend-seven.vercel.app/billing/all/wp")
      .then((res) => {
        setProductOptions(res.data.data.map((product) => product.productName));
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="mx-auto p-2 sm:p-6">
      <ToastContainer />
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-700 tracking-wide">
        {id ? "Update Invoice" : "Create Invoice"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-8 space-y-6"
      >
        {/* Invoice & Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Invoice Date</label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Invoice Number</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              placeholder="Invoice Number"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Customer Address</label>
            <textarea
              rows={2}
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              placeholder="Customer Address"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Customer Phone</label>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="Customer Phone"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="Customer Email"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Dispatch Through</label>
            <input
              type="text"
              name="dispatchThrough"
              value={formData.dispatchThrough}
              onChange={handleChange}
              placeholder="Dispatch Through (optional)"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Customer GSTIN</label>
            <input
              type="text"
              name="customerGST"
              value={formData.customerGST}
              onChange={handleChange}
              placeholder="Customer GSTIN"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Customer Aadhar</label>
            <input
              type="text"
              name="customerAadhar"
              value={formData.customerAadhar}
              onChange={handleChange}
              placeholder="Customer Aadhar"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-indigo-700">
            Product Details
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border rounded-lg">
              <thead className="bg-indigo-50 text-indigo-700">
                <tr>
                  <th className="p-2">Description</th>
                  <th className="p-2">Unit</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Discount %</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="bg-white md:bg-transparent">
                    <td className="p-2">
                      <input
                        list="product-list"
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleInputChange(e, index, "description")
                        }
                        placeholder="Product name"
                        className="border rounded p-2 w-full"
                      />
                      {index === 0 && (
                        <datalist id="product-list">
                          {productOptions.map((name, i) => (
                            <option key={i} value={name} />
                          ))}
                        </datalist>
                      )}
                    </td>
                    <td className="p-2">
                      <select
                        value={row.unit}
                        onChange={(e) => handleInputChange(e, index, "unit")}
                        className="border rounded p-2 w-full"
                      >
                        <option value="">Unit</option>
                        <option value="pcs">Pieces</option>
                        <option value="kg">Kilograms</option>
                        <option value="liters">Liters</option>
                        <option value="pack">Pack</option>
                        <option value="dozen">Dozen</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => {
                          handleInputChange(e, index, "quantity");
                          const updatedRows = [...rows];
                          const quantity =
                            parseFloat(updatedRows[index].quantity) || 0;
                          const price =
                            parseFloat(updatedRows[index].price) || 0;
                          const discount =
                            parseFloat(updatedRows[index].discount) || 0;
                          const amount =
                            price * quantity * (1 - discount / 100);
                          updatedRows[index].amount = amount.toFixed(2);
                          setRows(updatedRows);
                        }}
                        placeholder="Qty"
                        className="border rounded p-2 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) => {
                          handleInputChange(e, index, "price");
                          const updatedRows = [...rows];
                          const quantity =
                            parseFloat(updatedRows[index].quantity) || 0;
                          const price = parseFloat(e.target.value) || 0;
                          const discount =
                            parseFloat(updatedRows[index].discount) || 0;
                          const amount =
                            price * quantity * (1 - discount / 100);
                          updatedRows[index].amount = amount.toFixed(2);
                          setRows(updatedRows);
                        }}
                        placeholder="Price"
                        className="border rounded p-2 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={row.discount}
                        onChange={(e) => {
                          handleInputChange(e, index, "discount");
                          const updatedRows = [...rows];
                          const quantity =
                            parseFloat(updatedRows[index].quantity) || 0;
                          const price =
                            parseFloat(updatedRows[index].price) || 0;
                          const discount = parseFloat(e.target.value) || 0;
                          const amount =
                            price * quantity * (1 - discount / 100);
                          updatedRows[index].amount = amount.toFixed(2);
                          setRows(updatedRows);
                        }}
                        placeholder="Discount (%)"
                        className="border rounded p-2 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.amount}
                        readOnly
                        placeholder="Amount"
                        className="border rounded p-2 w-full bg-gray-100"
                      />
                    </td>
                    <td className="p-2">
                      <button
                        type="button"
                        onClick={handleAddRow}
                        className="bg-indigo-500 text-white px-3 py-1 rounded mb-1 w-full md:w-auto"
                      >
                        Add
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className={`bg-red-500 text-white px-3 py-1 rounded w-full md:w-auto ${
                          rows.length <= 1
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-red-600"
                        }`}
                        disabled={rows.length <= 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Amount Details */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <label className="mb-1 font-semibold block">GST Percentage</label>
            <input
              type="number"
              name="gstPercentage"
              value={formData.amountDetails.gstPercentage}
              onChange={handleDiscountChange}
              placeholder="GST Percentage"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 font-semibold block">
              Discount on Total
            </label>
            <input
              type="number"
              name="discountOnTotal"
              value={formData.amountDetails.discountOnTotal}
              onChange={handleDiscountChange}
              placeholder="Discount on Total"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 font-semibold block">Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.amountDetails.totalAmount}
              readOnly
              placeholder="Total Amount"
              className="border rounded-lg p-3 w-full bg-gray-100"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            type="submit"
            disabled={
              !formData.customerName ||
              !formData.invoiceDate ||
              !formData.dueDate ||
              !formData.customerGST ||
              !formData.customerAddress ||
              !formData.customerPhone ||
              !formData.customerEmail ||
              rows.some((row) => {
                return (
                  !row.description ||
                  !row.unit ||
                  !row.quantity ||
                  !row.price ||
                  !row.discount
                );
              })
            }
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all duration-200"
          >
            {id ? "Update Invoice" : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceNewForm;
