import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  IdentificationIcon,
  Squares2X2Icon,
  CameraIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { auth } from '../../services/firebase'; // Import Firebase auth

const DashBoard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data directly from Firebase auth
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        setError('No user logged in');
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/CustomerList"
          className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 hover:bg-blue-50 transition"
        >
          <UserCircleIcon className="w-10 h-10 text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Customers</h2>
            <p className="text-sm text-gray-500">Manage customer details</p>
          </div>
        </Link>

        <Link
          to="/List"
          className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 hover:bg-blue-50 transition"
        >
          <IdentificationIcon className="w-10 h-10 text-green-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Leads</h2>
            <p className="text-sm text-gray-500">Track and manage leads</p>
          </div>
        </Link>

        <Link
          to="/Common"
          className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 hover:bg-blue-50 transition"
        >
          <CameraIcon className="w-10 h-10 text-purple-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Gallery</h2>
            <p className="text-sm text-gray-500">View and manage images</p>
          </div>
        </Link>

        <Link
          to="/InvoiceNewList"
          className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 hover:bg-blue-50 transition"
        >
          <Squares2X2Icon className="w-10 h-10 text-yellow-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Invoices</h2>
            <p className="text-sm text-gray-500">Generate and manage invoices</p>
          </div>
        </Link>

        <Link
          to="/IternaryTable"
          className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 hover:bg-blue-50 transition"
        >
          <AdjustmentsHorizontalIcon className="w-10 h-10 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Itinerary</h2>
            <p className="text-sm text-gray-500">Plan and organize trips</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashBoard;