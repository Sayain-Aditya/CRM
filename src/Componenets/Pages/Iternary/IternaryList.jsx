import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // hook to navigate to another page
import { ToastContainer, toast } from "react-toastify"; // for toast notifications
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom"; // for navigation links
import axios from "axios"; // for making HTTP requests

const IternaryList = ({ leads, setLeads }) => {
  const { id } = useParams(); // Get the id from URL
  const navigate = useNavigate(); // hook to navigate to another page
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    if (id) {
      // Fetch existing itinerary data to edit
      axios
        .get(`https://billing-backend-seven.vercel.app/Iternary/mano/${id}`)
        .then((res) => {
          const {
            title,
            days,
            date,
            pickLoc,
            dropLoc,
            pickTime,
            dropTime,
            vehicle,
            package: packageName,
            cost,
            personNo,
            hotelType,
            advance,
            hotelSelected,
            destinations: dests,
            dynamicFields,
            costInclude,
            costExclude,
          } = res.data.data;
          setFormData({
            title: title || "",
            days: days || "",
            date: date || "",
            pickLoc: pickLoc || "",
            dropLoc: dropLoc || "",
            pickTime: pickTime || "",
            dropTime: dropTime || "",
            vehicle: vehicle || "",
            package: packageName || "",
            cost: cost || "",
            personNo: personNo || "",
            hotelType: hotelType || "",
            advance: advance || "",
            hotelSelected: hotelSelected || [],
            destinations: dests || [],
            dynamicFields: dynamicFields || Array().fill({ fieldName: "" }),
            costInclude: costInclude || [],
            costExclude: costExclude || [],
          });
          setDaySchedules(dynamicFields.map((day) => day.points || []));
          setActiveDay(1); // Reset to first day
        })
        .catch((err) => {
          toast.error("Failed to load itinerary data");
          console.error(err);
        });
    }
  }, [id]);

  const [formData, setFormData] = useState({
    title: "",
    days: "",
    date: "",
    pickLoc: "",
    dropLoc: "",
    pickTime: "",
    dropTime: "",
    vehicle: "",
    package: "",
    cost: "",
    personNo: "",
    hotelType: "",
    advance: "",
    dynamicFields: Array().fill({ fieldName: "" }), // Array to store dynamic fields
    hotelSelected: [],
    destinations: [],
  });
  const handleDynamicFieldChange = (index, value) => {
    setFormData((prev) => {
      const updatedFields = [...prev.dynamicFields];
      updatedFields[index].fieldName = value;
      return { ...prev, dynamicFields: updatedFields };
    });
  };

  const addDynamicField = () => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: [...prev.dynamicFields, { fieldName: "" }],
    }));
  };

  const removeDynamicField = (index) => {
    setFormData((prev) => {
      const updatedFields = [...prev.dynamicFields];
      updatedFields.splice(index, 1);
      return { ...prev, dynamicFields: updatedFields };
    });
  };
  const [dynamicFields, setDynamicFields] = useState([
    { dayTitle: "", points: [""] },
  ]);

  const [maxDays, setMaxDays] = useState(4); // Maximum number of days
  const [activeDay, setActiveDay] = useState(1); // Currently selected day
  const [daySchedules, setDaySchedules] = useState(
    Array.from({ length: 4 }, () => [])
  );

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(
          "https://billing-backend-seven.vercel.app/hotels"
        ); // 🔁 update this URL based on your API
        const hotelOptions = res.data.map((hotel) => ({
          id: hotel._id,
          label: hotel.name,
          value: hotel._id,
        }));
        setHotels(hotelOptions);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        toast.error("Failed to load hotels");
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get(
          "https://billing-backend-seven.vercel.app/destinations"
        ); // 🔁 update this URL based on your API
        const destinationOptions = res.data.map((destination) => ({
          id: destination._id,
          label: destination.name,
          value: destination._id,
        }));
        setDestinations(destinationOptions);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        toast.error("Failed to load destinations");
      }
    };

    fetchDestinations();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addDayTab = () => {
    setMaxDays((prev) => prev + 1);
    setDynamicFields((prev) => [...prev, { dayTitle: "", points: [""] }]);
  };

  const removeDayTab = () => {
    if (maxDays > 1) {
      setMaxDays((prev) => prev - 1);
      setDynamicFields((prev) => prev.slice(0, -1));
      if (activeDay > maxDays - 1) setActiveDay(maxDays - 1);
    }
  };

  const deleteDay = (indexToDelete) => {
    if (maxDays > 1) {
      setMaxDays((prev) => prev - 1);
      setDynamicFields((prev) => prev.filter((_, i) => i !== indexToDelete));
      if (activeDay > maxDays - 1) setActiveDay(1);
    }
  };

  const handleScheduleInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newSchedule = e.target.value.trim();
      setDaySchedules((prev) => {
        const updatedSchedules = [...prev];
        updatedSchedules[activeDay - 1] = [
          ...updatedSchedules[activeDay - 1],
          newSchedule,
        ];
        return updatedSchedules;
      });
      e.target.value = ""; // Clear the input field
    }
  };

  const addScheduleItem = (item) => {
    setDaySchedules((prev) => {
      const updatedSchedules = [...prev];
      updatedSchedules[activeDay - 1] = [
        ...updatedSchedules[activeDay - 1],
        item,
      ];
      return updatedSchedules;
    });
  };

  const deleteScheduleItem = (index) => {
    setDaySchedules((prev) => {
      const updatedSchedules = [...prev];
      updatedSchedules[activeDay - 1] = updatedSchedules[activeDay - 1].filter(
        (_, i) => i !== index
      );
      return updatedSchedules;
    });
  };

  const [costInclude, setCostInclude] = useState([]);
  const [costExclude, setCostExclude] = useState([]);

  // Add/Remove handlers for costInclude
  const addCostInclude = (item) => setCostInclude((prev) => [...prev, item]);
  const removeCostInclude = (idx) =>
    setCostInclude((prev) => prev.filter((_, i) => i !== idx));
  // Add/Remove handlers for costExclude
  const addCostExclude = (item) => setCostExclude((prev) => [...prev, item]);
  const removeCostExclude = (idx) =>
    setCostExclude((prev) => prev.filter((_, i) => i !== idx));

  // ...existing code...

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dynamicFields = daySchedules
      .map((schedule, index) => ({
        dayTitle: `Day ${index + 1}`,
        points: schedule,
      }))
      .filter((day) => Array.isArray(day.points) && day.points.length > 0);

    const finalData = {
      ...formData,
      hotelSelected: formData.hotelSelected.map((h) => h.value),
      destinations: formData.destinations.map((d) => d.value),
      dynamicFields,
      days: parseInt(formData.days),
      costInclude,
      costExclude,
    };
    try {
      if (id) {
        // Update existing itinerary
        await axios.put(
          `https://billing-backend-seven.vercel.app/Iternary/update/${id}`,
          finalData
        );
        toast.success("Itinerary updated successfully!");
      } else {
        // Add new itinerary
        await axios.post(
          "https://billing-backend-seven.vercel.app/Iternary/add",
          finalData
        );
        toast.success("Itinerary added successfully!");
      }
      navigate("/IternaryTable"); // Redirect to itinerary list
    } catch (error) {
      console.error("Error saving itinerary:", error);
      toast.error("Failed to save itinerary.");
    }
    // try {
    //   console.log("📦 Sending Final Data:", finalData);
    //   const res = await axios.post(
    //     "https://billing-backend-seven.vercel.app/Iternary/add",
    //     finalData
    //   );
    //   console.log("Itinerary saved:", res.data.message);
    //   toast.success("Itinerary saved!");
    // } catch (err) {
    //   console.error("Error saving itinerary:", err);
    //   toast.error("Failed to save itinerary.");
    // }

    // Reset after submit
    setFormData({
      title: "",
      days: "",
      date: "",
      pickLoc: "",
      dropLoc: "",
      pickTime: "",
      dropTime: "",
      vehicle: "",
      package: "",
      cost: "",
      personNo: "",
      hotelType: "",
      hotelSelected: [],
      destinations: [],
      dynamicFields: Array().fill({ fieldName: "" }),
    });
    setDaySchedules(Array.from({ length: 4 }, () => []));
    setActiveDay(1);
    setCostInclude([]);
    setCostExclude([]);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-4 px-1 flex justify-center">
      <div className="w-full">
        <ToastContainer position="top-right" reverseOrder={false} />

        <div
          className="overflow-y-auto h-full p-4 sm:p-6 lg:p-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
              `}
          </style>
          <div className="hide-scrollbar flex justify-end mb-4">
            {/* <Link
              to="/IternaryField"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg text-lg"
            >
              Print Itieranary
            </Link> */}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 tracking-wide w-full sm:w-auto">
            Add New Tour
          </h2>
          <Link to={`/IternaryField/${id}`} className="w-full sm:w-auto">
            <button 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-4 py-2 rounded-lg shadow-lg text-base font-semibold transition">
              Print Itinerary
            </button>
          </Link>
          <hr className="mb-4 border-gray-300" />

          <form className="space-y-8 text-gray-700 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-8 mt-4">
            {/* Tour Title & Days */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">Tour Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Tour Title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Number of Days
                </label>
                <input
                  type="number"
                  name="days"
                  placeholder="No. of days"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.days}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Date, Pickup, Drop, Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">
                  Date of Journey
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickLoc"
                  placeholder="Pickup address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pickLoc}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Drop Location
                </label>
                <input
                  type="text"
                  name="dropLoc"
                  placeholder="Drop address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.dropLoc}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Vehicle Type</label>
                <input
                  type="text"
                  name="vehicle"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.vehicle}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Time, Package, Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">Pickup Time</label>
                <input
                  type="time"
                  name="pickTime"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.pickTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Drop Time</label>
                <input
                  type="time"
                  name="dropTime"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.dropTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Package Name</label>
                <input
                  type="text"
                  name="package"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.package}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Package Cost</label>
                <input
                  type="number"
                  name="cost"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.cost}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Person, Hotel Type, Advance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold">
                  Number of Person
                </label>
                <input
                  type="number"
                  name="personNo"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.personNo}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Hotel Type</label>
                <select
                  name="hotelType"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.hotelType}
                  onChange={handleChange}
                >
                  <option>Budget Friendly Hotel</option>
                  <option>3-Star Hotel</option>
                  <option>4-Star Hotel</option>
                  <option>5-Star Hotel</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Advance Payment
                </label>
                <input
                  type="number"
                  name="advance"
                  placeholder="Advance payment"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.advance}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Dynamic Days Tabs */}
            <div className="dayNavigate flex flex-wrap gap-2 mb-6 items-center">
              {dynamicFields.map((_, i) => (
                <div key={i} className="relative">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition ${
                      activeDay === i + 1
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                    }`}
                    onClick={() => setActiveDay(i + 1)}
                  >
                    Day {i + 1}
                  </button>
                  {dynamicFields.length > 1 && (
                    <button
                      type="button"
                      title="Delete this day"
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                      onClick={() => deleteDay(i)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <div className="flex gap-2 ml-2">
                <button
                  type="button"
                  onClick={addDayTab}
                  title="Add Day"
                  className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition-all duration-200"
                >
                  <span className="text-lg">＋</span>
                  <span className="hidden xs:inline">Add Day</span>
                </button>
                <button
                  type="button"
                  onClick={removeDayTab}
                  disabled={dynamicFields.length <= 1}
                  title="Remove Last Day"
                  className={`flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow transition-all duration-200 ${
                    dynamicFields.length <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="text-lg">−</span>
                  <span className="hidden xs:inline">Remove Day</span>
                </button>
              </div>
            </div>
            {/* Schedule Input for Active Day */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{`Schedule for Day ${activeDay}`}</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="schedule-input"
                  placeholder="Enter schedule item"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={handleScheduleInput}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("schedule-input");
                    if (input && input.value.trim() !== "") {
                      addScheduleItem(input.value.trim());
                      input.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Add
                </button>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {daySchedules[activeDay - 1].map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => deleteScheduleItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Cost Includes/Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Cost Includes</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id="cost-include-input"
                    placeholder="Add cost include item"
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim() !== "") {
                        addCostInclude(e.target.value.trim());
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input =
                        document.getElementById("cost-include-input");
                      if (input && input.value.trim() !== "") {
                        addCostInclude(input.value.trim());
                        input.value = "";
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {costInclude.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeCostInclude(idx)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Cost Excludes</h3>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    id="cost-exclude-input"
                    placeholder="Add cost exclude item"
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim() !== "") {
                        addCostExclude(e.target.value.trim());
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input =
                        document.getElementById("cost-exclude-input");
                      if (input && input.value.trim() !== "") {
                        addCostExclude(input.value.trim());
                        input.value = "";
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {costExclude.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeCostExclude(idx)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Hotel & Destination MultiSelect */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">Select Hotel</label>
                <MultiSelect
                  options={hotels}
                  value={formData.hotelSelected}
                  onChange={(selected) => {
                    setFormData((prev) => ({
                      ...prev,
                      hotelSelected: selected,
                    }));
                  }}
                  labelledBy="Select"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">
                  Select Destinations
                </label>
                <MultiSelect
                  options={destinations}
                  value={formData.destinations}
                  onChange={(selected) => {
                    setFormData((prev) => ({
                      ...prev,
                      destinations: selected,
                    }));
                  }}
                  labelledBy="Select"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="text-center mt-6">
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={
                  !formData.title ||
                  !formData.days ||
                  !formData.pickLoc ||
                  !formData.dropLoc
                }
                className="w-full sm:w-auto px-10 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200"
              >
                {id ? "Update Itinerary" : "Add Itinerary"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IternaryList;
