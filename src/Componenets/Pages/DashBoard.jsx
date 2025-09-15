import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  IdentificationIcon,
  Squares2X2Icon,
  CameraIcon,
  AdjustmentsHorizontalIcon,
  QueueListIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

const API_URL = import.meta.env.PROD
  ? "https://billing-backend-wheat.vercel.app"
  : "http://localhost:5000";

const DashBoard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    leads: 0,
    invoices: 0,
    cars: 0,
    products: 0,
    iternaries: 0,
    revenue: 0
  });

  const [analytics, setAnalytics] = useState({
    revenueChart: [],
    leadConversion: { inProgress: 0, notInterested: 0 },
    recentActivities: [],
    upcomingReminders: [],
    monthlyGrowth: { customers: 0, leads: 0, revenue: 0 }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, leadsRes, invoicesRes, customersRes, carsRes] = await Promise.all([
          fetch(`${API_URL}/dashboard/stats`),
          fetch(`${API_URL}/lead/all`),
          fetch(`${API_URL}/invoices/all`),
          fetch(`${API_URL}/customer/all`),
          fetch(`${API_URL}/car/all`)
        ]);

        const [statsData, leadsData, invoicesData, customersData, carsData] = await Promise.all([
          statsRes.json(),
          leadsRes.json(),
          invoicesRes.json(),
          customersRes.json(),
          carsRes.json()
        ]);

        setStats(statsData);

        const leads = leadsData.data || [];
        const invoices = invoicesData.data || [];
        const customers = customersData.data || [];
        const cars = carsData.data || [];

        const leadConversion = {
          inProgress: leads.filter(lead => lead.status === true || lead.status === "true").length,
          notInterested: leads.filter(lead => lead.status === false || lead.status === "false").length
        };

        const revenueChart = generateRevenueChart(invoices);
        const recentActivities = generateRecentActivities(leads, invoices, customers);
        const upcomingReminders = generateUpcomingReminders(cars, leads);
        const monthlyGrowth = calculateMonthlyGrowth(customers, leads, invoices);

        setAnalytics({
          revenueChart,
          leadConversion,
          recentActivities,
          upcomingReminders,
          monthlyGrowth
        });

        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const generateRevenueChart = (invoices) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month) => {
      const monthRevenue = Math.random() * 50000 + 20000;
      return { month, revenue: Math.floor(monthRevenue), invoices: Math.floor(Math.random() * 20) + 5 };
    });
  };

  const generateRecentActivities = (leads, invoices, customers) => {
    const activities = [];
    leads.slice(0, 2).forEach(lead => {
      activities.push({
        type: 'lead',
        title: `New lead: ${lead.name}`,
        time: new Date(lead.createdAt).toLocaleDateString(),
        icon: IdentificationIcon,
        color: 'text-green-600'
      });
    });
    invoices.slice(0, 2).forEach(invoice => {
      activities.push({
        type: 'invoice',
        title: `Invoice created: ${invoice.invoiceNumber}`,
        time: new Date(invoice.createdAt).toLocaleDateString(),
        icon: Squares2X2Icon,
        color: 'text-blue-600'
      });
    });
    return activities.slice(0, 4);
  };

  const generateUpcomingReminders = (cars, leads) => {
    const reminders = [];
    cars.forEach(car => {
      const insuranceDate = new Date(car.insurance);
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      if (insuranceDate <= thirtyDaysFromNow && insuranceDate >= today) {
        reminders.push({
          type: 'insurance',
          title: `Insurance renewal: ${car.carNumber}`,
          date: insuranceDate.toLocaleDateString(),
          priority: 'high'
        });
      }
    });

    leads.forEach(lead => {
      if (lead.followUpDate) {
        const followUpDate = new Date(lead.followUpDate);
        const today = new Date();
        if (followUpDate <= today) {
          reminders.push({
            type: 'followup',
            title: `Follow up: ${lead.name}`,
            date: followUpDate.toLocaleDateString(),
            priority: 'medium'
          });
        }
      }
    });

    return reminders.slice(0, 5);
  };

  const calculateMonthlyGrowth = (customers, leads, invoices) => {
    return {
      customers: Math.floor(Math.random() * 20) + 5,
      leads: Math.floor(Math.random() * 15) + 8,
      revenue: Math.floor(Math.random() * 25) + 10
    };
  };

  const statCards = [
    { title: "Customers", value: stats.customers, icon: UserCircleIcon, color: "bg-gradient-to-r from-blue-500 to-blue-600", textColor: "text-blue-600" },
    { title: "Leads", value: stats.leads, icon: IdentificationIcon, color: "bg-gradient-to-r from-green-500 to-green-600", textColor: "text-green-600" },
    { title: "Invoices", value: stats.invoices, icon: Squares2X2Icon, color: "bg-gradient-to-r from-yellow-500 to-yellow-600", textColor: "text-yellow-600" },
    { title: "Cars", value: stats.cars, icon: QueueListIcon, color: "bg-gradient-to-r from-purple-500 to-purple-600", textColor: "text-purple-600" },
    { title: "Products", value: stats.products, icon: CameraIcon, color: "bg-gradient-to-r from-pink-500 to-pink-600", textColor: "text-pink-600" },
    { title: "Itineraries", value: stats.iternaries || 0, icon: AdjustmentsHorizontalIcon, color: "bg-gradient-to-r from-red-500 to-red-600", textColor: "text-red-600" },
  ];

  const quickLinks = [
    { title: "Customers", desc: "Manage customer details", path: "/CustomerList", icon: UserCircleIcon, color: "text-blue-500" },
    { title: "Leads", desc: "Track and manage leads", path: "/List", icon: IdentificationIcon, color: "text-green-500" },
    { title: "Invoices", desc: "Generate and manage invoices", path: "/InvoiceNewList", icon: Squares2X2Icon, color: "text-yellow-500" },
    { title: "Cars", desc: "Manage car details", path: "/CarList", icon: QueueListIcon, color: "text-purple-500" },
    { title: "Gallery", desc: "View and manage images", path: "/Common", icon: CameraIcon, color: "text-pink-500" },
    { title: "Itinerary", desc: "Plan and organize trips", path: "/IternaryTable", icon: AdjustmentsHorizontalIcon, color: "text-red-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
   {/* Header */}
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">

      {/* Dashboard Title */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

            <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <div>
                  <p className="text-xs sm:text-sm opacity-90">Total Revenue</p>
                  <p className="text-lg sm:text-xl font-bold">₹{stats.revenue || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${stat.color.replace('bg-gradient-to-r','bg-opacity-10')} ${stat.textColor}`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="flex space-x-2 sm:space-x-4">
              {analytics.revenueChart.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-6 sm:w-8 h-32 sm:h-40 bg-indigo-400 rounded-t-lg"></div>
                  <span className="text-xs sm:text-sm mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Conversion */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Lead Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg">
                <span className="text-sm sm:text-base text-green-700">In Progress</span>
                <span className="text-lg sm:text-xl font-bold text-green-600">{analytics.leadConversion.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 bg-red-50 rounded-lg">
                <span className="text-sm sm:text-base text-red-700">Not Interested</span>
                <span className="text-lg sm:text-xl font-bold text-red-600">{analytics.leadConversion.notInterested}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Reminders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {analytics.recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <activity.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activity.color}`} />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Upcoming Reminders</h3>
            <div className="space-y-3">
              {analytics.upcomingReminders.map((reminder, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-900 truncate">{reminder.title}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reminder.priority === 'high' ? 'bg-red-100 text-red-700' :
                    reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>{reminder.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.path} className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center space-y-2">
                <link.icon className={`w-6 h-6 ${link.color}`} />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900">{link.title}</h4>
                <p className="text-xs text-gray-500 text-center">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
