import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { requestNotificationPermission } from '../../../services/notificationService';

async function getPushSubscription() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  }
  return null;
}

const LeadsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    Address: "",
    enquiry: "Select Enquiry",
    followUpDate: "",
    followUpStatus: "Pending",
    meetingdate: "",
    status: "true",
    calldate: "",
    update: "",
    notes: "",
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://billing-backend-seven.vercel.app/lead/mano/${id}`)
        .then((res) => {
          const {
            name,
            email,
            phone,
            Address,
            enquiry,
            followUpDate,
            followUpStatus,
            meetingdate,
            status,
            calldate,
            update,
            notes,
          } = res.data.data;
          setFormData({
            name: name || "",
            email: email || "",
            phone: phone || "",
            Address: Address || "",
            enquiry: enquiry || "Select Enquiry",
            followUpDate: followUpDate || "",
            followUpStatus: followUpStatus || "Pending",
            meetingdate: meetingdate || "",
            status: status || "true",
            calldate: calldate || "",
            update: update || "",
            notes: notes || "",
          });
        })
        .catch((err) => {
          toast.error("Failed to load Leads data");
          console.error(err);
        });
    }
  }, [id]);

  useEffect(() => {
    const checkNotificationStatus = async () => {
      const permission = await requestNotificationPermission();
      setNotificationsEnabled(permission);
    };
    checkNotificationStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subscription = await getPushSubscription();

      const followUpDateUTC = new Date(formData.followUpDate).toISOString();
      const payload = {
        ...formData,
        followUpDate: followUpDateUTC,
        subscription,
      };

      let response;
      if (id) {
        response = await axios.put(
          "http://localhost:5000/lead/update/" + id,
          payload
        );
        toast.success("Lead updated successfully");
      } else {
        response = await axios.post(
          "http://localhost:5000/lead/add",
          payload
        );
        toast.success("Lead added successfully");
      }

      navigate("/List");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const testNotification = () => {
    if (notificationsEnabled) {
      toast.info("Test notification would appear here (scheduling removed)");
    } else {
      toast.warning("Please enable notifications first");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6 rounded-2xl shadow-xl border border-gray-200 bg-white h-[100vh]">
      <ToastContainer position="top-right" reverseOrder={false} />
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-700 tracking-wide">
        {id ? "Update Lead" : "Add New Lead"}
      </h2>
      <hr className="mb-6 border-gray-300" />

      <div className="overflow-y-auto h-[75vh] pr-3">
        <form onSubmit={handleSubmit} className="space-y-8 text-gray-700">
          {/* Name & Primary Number */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Customer Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Primary Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Secondary Number & Address */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Address</label>
              <input
                type="text"
                name="Address"
                placeholder="Full address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.Address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Enquiry & Follow-up */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Enquiry Type</label>
              <select
                name="enquiry"
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.enquiry}
                onChange={handleChange}
              >
                <option value="Select Enquiry" disabled>
                  Select Enquiry
                </option>
                <option value="Enquiry 1">Enquiry 1</option>
                <option value="Enquiry 2">Enquiry 2</option>
                <option value="Enquiry 3">Enquiry 3</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Follow-Up Date & Time
                {notificationsEnabled ? (
                  <span className="text-green-500 ml-2 text-sm">
                    🔔 Notifications enabled
                  </span>
                ) : (
                  <span className="text-yellow-500 ml-2 text-sm">
                    🔕 Notifications disabled
                  </span>
                )}
              </label>
              <input
                type="datetime-local"
                name="followUpDate"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.followUpDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Follow-up Status & Meeting Date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">
                Follow-Up Status
              </label>
              <select
                name="followUpStatus"
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.followUpStatus}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Meeting Date</label>
              <input
                type="datetime-local"
                name="meetingdate"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.meetingdate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status & Call Date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Lead Status</label>
              <select
                name="status"
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Call Date</label>
              <input
                type="datetime-local"
                name="calldate"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.calldate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Updated Date */}
          <div>
            <label className="block mb-2 font-semibold">Last Updated</label>
            <input
              type="datetime-local"
              name="update"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.update}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2 font-semibold">Additional Notes</label>
            <textarea
              name="notes"
              required
              value={formData.notes}
              onChange={handleChange}
              placeholder="Write any important notes here..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="px-10 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200"
            >
              {id ? "Update" : "Submit"} Lead
            </button>
            <button
              type="button"
              onClick={testNotification}
              className="ml-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Test Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadsForm;
