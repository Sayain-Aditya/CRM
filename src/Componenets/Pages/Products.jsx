import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, Trash2 } from "lucide-react"; // Icons for buttons

export default function Product() {
  const formRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productUnit: "",
    productDiscount: "",
    productStock: "",
  });

  const startEditingProduct = (product) => {
    setEditingId(product._id);
    setFormData({
      productName: product.productName,
      productPrice: product.productPrice,
      productUnit: product.productUnit,
      productDiscount: product.productDiscount,
      productStock: product.productStock,
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    toast.info("Editing product...");
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://billing-backend-seven.vercel.app/billing/all"
      );
      setProducts(res.data.data);
    } catch (error) {
      toast.error("No more product list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `https://billing-backend-seven.vercel.app/billing/update/${editingId}`,
          formData
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(
          "https://billing-backend-seven.vercel.app/billing/create",
          formData
        );
        toast.success("Product created successfully");
      }
      setFormData({
        productName: "",
        productPrice: "",
        productUnit: "",
        productDiscount: "",
        productStock: "",
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://billing-backend-seven.vercel.app/billing/delete/${id}`
      );
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="mx-auto p-6">
      <ToastContainer />

      {/* Form Section */}
      <div className=" p-8 rounded-2xl mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🛒 {editingId ? "Update" : "Add"} Product
        </h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 sm:gap-x-6"
        >
          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-gray-700"
              htmlFor="productName"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              name="productName"
              value={formData.productName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              placeholder="Product Name"
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-gray-700"
              htmlFor="productPrice"
            >
              Amount (₹)
            </label>
            <input
              id="productPrice"
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productPrice: e.target.value,
                }))
              }
              placeholder="Amount (₹)"
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-gray-700"
              htmlFor="productDiscount"
            >
              Discount %
            </label>
            <input
              id="productDiscount"
              type="number"
              name="productDiscount"
              value={formData.productDiscount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productDiscount: e.target.value,
                }))
              }
              placeholder="Discount %"
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-gray-700"
              htmlFor="productUnit"
            >
              Unit
            </label>
            <select
              id="productUnit"
              name="productUnit"
              value={formData.productUnit}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productUnit: e.target.value,
                }))
              }
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition bg-white"
            >
              <option value="">Select Unit</option>
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="liters">Liters</option>
              <option value="pack">Pack</option>
              <option value="dozen">Dozen</option>
            </select>
          </div>
          <div className="flex flex-col md:col-span-2">
            <label
              className="mb-1 font-semibold text-gray-700"
              htmlFor="productStock"
            >
              Stock Quantity
            </label>
            <input
              id="productStock"
              type="number"
              name="productStock"
              value={formData.productStock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productStock: e.target.value,
                }))
              }
              placeholder="Stock Quantity"
              className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-center text-white uppercase transition duration-200 ease-in-out bg-indigo-600 rounded-md cursor-pointer hover:bg-indigo-700"
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    productName: "",
                    productPrice: "",
                    productUnit: "",
                    productDiscount: "",
                    productStock: "",
                  });
                }}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-center text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Products List
        </h2>

        {isLoading ? (
          <p className="text-center text-blue-600">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products available</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
                  <thead className="bg-blue-50 text-blue-700 text-sm uppercase">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Amount (₹)</th>
                      <th className="p-3 text-left">Discount</th>
                      <th className="p-3 text-left">Unit</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="bg-gray-50 hover:bg-blue-100 transition-all rounded-lg shadow-sm"
                      >
                        <td className="p-3 font-semibold text-blue-800">
                          {product.productName}
                        </td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                            ₹{product.productPrice}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">
                            {product.productDiscount}% OFF
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                            {product.productUnit}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold">
                            {product.productStock}
                          </span>
                        </td>
                        <td className="p-3 flex justify-center gap-2">
                          <button
                            onClick={() => startEditingProduct(product)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow transition-all"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow transition-all"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 xs:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-2 transition-transform hover:scale-[1.02] hover:shadow-xl min-w-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-blue-700 truncate">
                      {product.productName}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {product.productUnit}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                      ₹{product.productPrice}
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded">
                      {product.productDiscount}% OFF
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                      Stock: {product.productStock}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEditingProduct(product)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
