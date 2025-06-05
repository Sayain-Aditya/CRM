import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddImage = () => {
  const [imagesByHotel, setImagesByHotel] = useState({});
  const [visible, setVisible] = useState(false);
  const [seltOption, setSelctOption] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (seltOption) fetchImages();
  }, [seltOption]);

  const fetchHotels = async () => {
    try {
      const res = await axios.get(
        "https://billing-backend-seven.vercel.app/hotels"
      );
      setHotels(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch hotels.");
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://billing-backend-seven.vercel.app/gals/all?hotelId=${seltOption}`
      );
      setImagesByHotel((prev) => ({
        ...prev,
        [seltOption]: res.data,
      }));
    } catch (err) {
      toast.error("❌ Failed to fetch images.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    setSelctOption(e.target.value);
    setVisible(false); // reset visibility if hotel changes
  };

  const handelClick = () => {
    if (seltOption && !visible) {
      setVisible(true);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const existingImages = imagesByHotel[seltOption] || [];

    const existingNames = new Set(existingImages.map((img) => img.name));
    const newFiles = files.filter((file) => !existingNames.has(file.name));

    if (newFiles.length === 0) {
      toast.error("⚠️ All selected files are duplicates.");
      return;
    }

    if (newFiles.length > 20) {
      toast.error(
        "⚠️ You can only select up to 20 new (non-duplicate) images."
      );
      return;
    }

    const formData = new FormData();
    newFiles.forEach((file) => formData.append("images", file));
    formData.append("hotelId", seltOption);

    try {
      const res = await axios.post(
        "https://billing-backend-seven.vercel.app/gals/upload-images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("✅ Images uploaded successfully!");
      await fetchImages(); // 🔄 fetch updated images
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `https://billing-backend-seven.vercel.app/gals/delete/${id}`
      );
      toast.success("🗑️ Image deleted successfully.");
      fetchImages(); // refresh list
    } catch (error) {
      toast.error("❌ Error deleting image");
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
      >
        Back
      </button>

      <div>
        <div className="text-black font-bold text-xl mb-4">Image Uploader</div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              onChange={handleSelectChange}
              value={seltOption}
              className="border col-span-1 border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Hotel</option>
              {hotels?.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>

            <button
              disabled={!seltOption}
              onClick={handelClick}
              className={`w-full rounded-lg text-white py-2 ${
                seltOption
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add Image
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6"></div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600">
          Bulk Image Upload
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          Max 20 images | Max 500 KB per image
        </p>
      </div>
      {visible && (
        <div className="border-2 border-dashed border-blue-400 bg-gray-100 p-10 rounded-xl flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0l5 5-5 5M13 8h7m-7 4h4"
                />
              </svg>
              <p className="text-gray-500 mt-2">
                Click to upload or drag and drop images
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <p className="text-center text-blue-500 mt-4">Loading images...</p>
      )}

      {/* Image Table */}
      {/* {!loading && imagesByHotel[seltOption]?.length > 0 && (
        <div className="hidden sm:block mt-10">
          <div className="mt-10">
            <div className="bg-gray-500 text-white p-4 border-t rounded-t-md font-semibold">
              Images for {hotels.find((h) => h._id === seltOption)?.name}
            </div>
            <table className="min-w-full bg-white shadow-md overflow-hidden">
              <thead>
                <tr className="bg-gray-300 text-black uppercase text-sm">
                  <th className="py-3 px-6">Sr. No</th>
                  <th className="py-3 px-6">Image URL</th>
                  <th className="py-3 px-6">Preview</th>
                  <th className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {imagesByHotel[seltOption].map((img, idx) => (
                  <tr
                    key={img._id}
                    className="border-t hover:bg-gray-50 text-center text-gray-600"
                  >
                    <td className="py-3 px-6">{idx + 1}</td>
                    <td className="py-3 px-6 truncate">{img.name || "N/A"}</td>
                    <td className="py-3 px-6 flex justify-center">
                      <img
                        src={img.url}
                        alt="uploaded"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => removeImage(img._id)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}

      {/* Mobile Grid View */}
      {!loading && imagesByHotel[seltOption]?.length > 0 && (
        <div className="mt-10">
          <div className="bg-gray-500 text-white p-4 border-t rounded-t-md font-semibold">
            Images for {hotels.find((h) => h._id === seltOption)?.name}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {imagesByHotel[seltOption].map((img, idx) => (
              <div
                key={img._id}
                className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center gap-2 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <img
                  src={img.url}
                  alt="uploaded"
                  className="w-24 h-24 rounded-md object-cover"
                />
                <p
                  className="text-sm text-gray-600 truncate text-center mt-2 w-full"
                  title={img.name || "N/A"} // Tooltip to show full name on hover
                >
                  {img.name || "N/A"}
                </p>
                <button
                  onClick={() => removeImage(img._id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default AddImage;
