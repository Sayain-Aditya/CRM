import React from 'react'
import { Link } from 'react-router-dom'
import {
  UserCircleIcon,
  IdentificationIcon,
  Squares2X2Icon,
  CameraIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

const DashBoard = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/CustomerList"
          className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition"
        >
          <UserCircleIcon className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-blue-700">Customers</h2>
            <p className="text-gray-600">Manage customer information</p>
          </div>
        </Link>

        <Link
          to="/List"
          className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition"
        >
          <IdentificationIcon className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-blue-700">Leads</h2>
            <p className="text-gray-600">Track and manage leads</p>
          </div>
        </Link>

        <Link
          to="/Products"
          className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition"
        >
          <Squares2X2Icon className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-blue-700">Products</h2>
            <p className="text-gray-600">View and manage products</p>
          </div>
        </Link>

        <Link
          to="/Common"
          className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition"
        >
          <CameraIcon className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-blue-700">Gallery</h2>
            <p className="text-gray-600">Browse and manage images</p>
          </div>
        </Link>

        <Link
          to="/InvoiceNewList"
          className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition"
        >
          <AdjustmentsHorizontalIcon className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-blue-700">Invoices</h2>
            <p className="text-gray-600">Generate and manage invoices</p>
          </div>
        </Link>

        <Link
          to="/IternaryTable"
          className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg hover:bg-blue-50 transition"
        >
          <Squares2X2Icon className="w-10 h-10 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-blue-700">Itinerary</h2>
            <p className="text-gray-600">Plan and manage itineraries</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DashBoard