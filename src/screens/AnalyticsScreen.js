import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../store/slices/orderSlice';
import { fetchAllUsers } from '../store/slices/userSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { FaChartLine, FaUsers, FaShoppingCart, FaDollarSign, FaEye, FaCalendarAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const AnalyticsScreen = () => {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading } = useSelector((state) => state.order);
  const { users, loading: usersLoading } = useSelector((state) => state.user);
  const { products, loading: productsLoading } = useSelector((state) => state.product);

  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90 days
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dispatch(fetchAllOrders()),
      dispatch(fetchAllUsers()),
      dispatch(fetchProducts({ pageSize: 1000 }))
    ]).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (!orders || !users || !products) return {};

    const now = new Date();
    const daysAgo = new Date(now.getTime() - (parseInt(timeRange) * 24 * 60 * 60 * 1000));

    // Filter data by time range
    const recentOrders = orders.filter(order => new Date(order.createdAt) >= daysAgo);
    const recentUsers = users.filter(user => new Date(user.createdAt) >= daysAgo);

    // Calculate metrics
    const totalRevenue = recentOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalOrders = recentOrders.length;
    const totalUsers = recentUsers.length;
    const totalProducts = products.length;

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate conversion rate (orders per user)
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

    // Calculate daily sales
    const dailySales = {};
    recentOrders.forEach(order => {
      const date = new Date(order.createdAt).toDateString();
      dailySales[date] = (dailySales[date] || 0) + (order.totalPrice || 0);
    });

    // Calculate top products
    const productSales = {};
    recentOrders.forEach(order => {
      order.orderItems?.forEach(item => {
        productSales[item.name] = (productSales[item.name] || 0) + item.qty;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Calculate order status distribution
    const statusDistribution = {
      pending: recentOrders.filter(o => !o.isPaid).length,
      paid: recentOrders.filter(o => o.isPaid && !o.isDelivered).length,
      delivered: recentOrders.filter(o => o.isDelivered).length
    };

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      averageOrderValue,
      conversionRate,
      dailySales,
      topProducts,
      statusDistribution
    };
  };

  const analytics = calculateAnalytics();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading || ordersLoading || usersLoading || productsLoading) {
    return <Loader />;
  }

  return (
    <>
      <Meta title="Analytics | MearnSneakers Admin" />
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your business performance and insights</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaDollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <FaChartLine className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageOrderValue || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="font-semibold">{analytics.statusDistribution?.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Paid</span>
                </div>
                <span className="font-semibold">{analytics.statusDistribution?.paid || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Delivered</span>
                </div>
                <span className="font-semibold">{analytics.statusDistribution?.delivered || 0}</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-3">
              {analytics.topProducts?.length > 0 ? (
                analytics.topProducts.map(([productName, quantity], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">{productName}</span>
                    <span className="font-semibold">{quantity} sold</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sales data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
            <div className="flex items-center">
              <FaArrowUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate?.toFixed(1) || 0}%</p>
                <p className="text-sm text-gray-600">Orders per user</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Products</h3>
            <div className="flex items-center">
              <FaEye className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts || 0}</p>
                <p className="text-sm text-gray-600">Active products</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Rate</h3>
            <div className="flex items-center">
              <FaArrowUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">+12.5%</p>
                <p className="text-sm text-gray-600">vs last period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {orders?.slice(0, 5).map((order, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <FaCalendarAlt className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalPrice || 0)}</p>
                  <p className="text-xs text-gray-600">
                    {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsScreen;
