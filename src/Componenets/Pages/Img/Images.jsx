import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const Images = () => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // 🔄 Load existing images from backend and set up polling
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          "https://billing-backend-seven.vercel.app/common/all"
        );
        setImages(res.data); // Assuming backend returns [{ _id, url, name }]
      } catch (err) {
        toast.error("❌ Failed to fetch images.");
      }
    };

    fetchImages(); // Initial fetch

    // Set up polling every 5 seconds (adjust timing as needed)
    const interval = setInterval(fetchImages, 2000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 20) {
      toast.error("⚠️ You can only select up to 20 images.");
      return;
    }

    const newFileNames = files.map((file) => file.name);
    const uploadedFileNames = images.map((img) => img.name);

    const duplicatesInSelection = newFileNames.filter(
      (name, index) => newFileNames.indexOf(name) !== index
    );

    const alreadyExists = newFileNames.filter((name) =>
      uploadedFileNames.includes(name)
    );

    const allDuplicates = [
      ...new Set([...duplicatesInSelection, ...alreadyExists]),
    ];

    if (allDuplicates.length > 0) {
      toast.error(`⚠️ Duplicate image(s): ${allDuplicates.join(", ")}`);
    }

    const uniqueFiles = files.filter(
      (file) => !allDuplicates.includes(file.name)
    );

    if (uniqueFiles.length > 0) {
      const formData = new FormData();
      uniqueFiles.forEach((file) => {
        formData.append("images", file);
      });

      try {
        const res = await fetch(
          "https://billing-backend-seven.vercel.app/common/upload-images",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (res.ok) {
          toast.success("✅ Images uploaded successfully!");
          setImages((prev) => [...prev, ...data.data]); // Firebase URLs from backend
        } else {
          toast.error(data.message || "❌ Upload failed");
        }
      } catch (err) {
        toast.error("❌ Error uploading images");
      }
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
        `https://billing-backend-seven.vercel.app/common/delete/${id}`
      );
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("🗑️ Image deleted successfully.");
    } catch (error) {
      toast.error("❌ Error deleting image");
    }
  };

  return (
    <div className="mx-auto p-6">
      <Toaster position="top-center" />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600">
          Bulk Image Upload
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          Max 20 images | Max 500 KB per image
        </p>
      </div>

      {/* Upload Box */}
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

      {images.length > 0 && (
        <>
          <div className="hidden sm:block overflow-auto mt-10">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Uploaded Images
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="bg-gray-300 text-black uppercase text-sm">
                    <th className="py-3 px-6">Sr. No</th>
                    <th className="py-3 px-6">Image Name</th>
                    <th className="py-3 px-6">Preview</th>
                    <th className="py-3 px-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((img, idx) => (
                    <tr
                      key={img._id}
                      className="border-t hover:bg-gray-50 text-center text-gray-600"
                    >
                      <td className="py-3 px-6">{idx + 1}</td>
                      <td className="py-3 px-6 truncate">
                        {img.name || "N/A"}
                      </td>
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
          {/* Mobile Images Card View */}
          <div className="sm:hidden grid grid-cols-2 gap-4 mt-10">
            {images.map((img, idx) => (
              <div
                key={img._id}
                className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center gap-2 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-24 h-24 rounded-md object-cover border-2 border-indigo-200 shadow"
                />
                <p className="text-sm text-gray-600 truncate text-center mt-2">
                  {img.name || "N/A"}
                </p>
                <button
                  onClick={() => removeImage(img._id)}
                  className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs font-semibold shadow transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Images;
