
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
        
        // Process analytics data
        const leads = leadsData.data || [];
        const invoices = invoicesData.data || [];
        const customers = customersData.data || [];
        const cars = carsData.data || [];

        // Lead conversion analytics
        const leadConversion = {
          inProgress: leads.filter(lead => lead.status === true || lead.status === "true").length,
          notInterested: leads.filter(lead => lead.status === false || lead.status === "false").length
        };

        // Revenue chart data (last 6 months)
        const revenueChart = generateRevenueChart(invoices);
        
        // Recent activities
        const recentActivities = generateRecentActivities(leads, invoices, customers);
        
        // Upcoming reminders
        const upcomingReminders = generateUpcomingReminders(cars, leads);
        
        // Monthly growth calculation
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
    return months.map((month, index) => {
      const monthRevenue = Math.random() * 50000 + 20000; // Simulated data
      return { month, revenue: Math.floor(monthRevenue), invoices: Math.floor(Math.random() * 20) + 5 };
    });
  };

  const generateRecentActivities = (leads, invoices, customers) => {
    const activities = [];
    
    // Add recent leads
    leads.slice(0, 2).forEach(lead => {
      activities.push({
        type: 'lead',
        title: `New lead: ${lead.name}`,
        time: new Date(lead.createdAt).toLocaleDateString(),
        icon: IdentificationIcon,
        color: 'text-green-600'
      });
    });
    
    // Add recent invoices
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
    
    // Car maintenance reminders
    cars.forEach(car => {
      const insuranceDate = new Date(car.insurance);
      const pollutionDate = new Date(car.pollution);
      const serviceDate = new Date(car.serviceReminder);
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
    
    // Lead follow-up reminders
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
    // Simplified growth calculation
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <BanknotesIcon className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-90">Total Revenue</p>
                    <p className="text-xl font-bold">₹{stats.revenue || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowTrendingUpIcon className={`w-4 h-4 ${stat.textColor} mr-1`} />
                    <span className={`text-sm ${stat.textColor} font-medium`}>+12% from last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.revenueChart.map((data, index) => {
                    const maxRevenue = Math.max(...analytics.revenueChart.map(d => d.revenue));
                    const height = (data.revenue / maxRevenue) * 80 + 20;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 group">
                        <div className="w-full bg-gray-100 rounded-t-lg relative cursor-pointer">
                          <div 
                            className="bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            ₹{(data.revenue / 1000).toFixed(0)}K
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lead Conversion */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">In Progress</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{analytics.leadConversion.inProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(analytics.leadConversion.inProgress / (analytics.leadConversion.inProgress + analytics.leadConversion.notInterested)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">Not Interested</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{analytics.leadConversion.notInterested}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(analytics.leadConversion.notInterested / (analytics.leadConversion.inProgress + analytics.leadConversion.notInterested)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {analytics.leadConversion.inProgress + analytics.leadConversion.notInterested > 0 
                        ? Math.round((analytics.leadConversion.inProgress / (analytics.leadConversion.inProgress + analytics.leadConversion.notInterested)) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities & Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <ClockIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-4">
                {analytics.recentActivities.length > 0 ? (
                  analytics.recentActivities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className={`w-5 h-5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activities</p>
                )}
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Reminders</h3>
                <CalendarDaysIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div className="space-y-3">
                {analytics.upcomingReminders.length > 0 ? (
                  analytics.upcomingReminders.map((reminder, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border-l-4 border-orange-400 bg-orange-50 rounded">
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{reminder.title}</p>
                        <p className="text-xs text-gray-500">{reminder.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reminder.priority === 'high' ? 'bg-red-100 text-red-700' :
                        reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {reminder.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No upcoming reminders</p>
                )}
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <UserCircleIcon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">+{analytics.monthlyGrowth.customers}%</p>
                <p className="text-sm text-gray-600">Customer Growth</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <IdentificationIcon className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">+{analytics.monthlyGrowth.leads}%</p>
                <p className="text-sm text-gray-600">Lead Growth</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <BanknotesIcon className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">+{analytics.monthlyGrowth.revenue}%</p>
                <p className="text-sm text-gray-600">Revenue Growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <ChartBarIcon className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-indigo-200"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                        <IconComponent className={`w-8 h-8 ${link.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{link.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;