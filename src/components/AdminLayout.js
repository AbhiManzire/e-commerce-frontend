import React, { useState } from 'react';
import { Link, useNavigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaChartBar, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaCog
} from 'react-icons/fa';
import './AdminLayout.css';
import AdminDashboard from '../screens/AdminDashboard';
import UserListScreen from '../screens/UserListScreen';
import UserEditScreen from '../screens/UserEditScreen';
import UserAddScreen from '../screens/UserAddScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductEditScreen from '../screens/ProductEditScreen';
import ProductAddScreen from '../screens/ProductAddScreen';
import OrderListScreen from '../screens/OrderListScreen';
import OrderViewScreen from '../screens/OrderViewScreen';
import OrderEditScreen from '../screens/OrderEditScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: FaHome, path: '/admin/dashboard' },
    { name: 'Products', icon: FaBox, path: '/admin/productlist' },
    { name: 'Users', icon: FaUsers, path: '/admin/userlist' },
    { name: 'Orders', icon: FaShoppingCart, path: '/admin/orderlist' },
    { name: 'Analytics', icon: FaChartBar, path: '/admin/analytics' },
    { name: 'Settings', icon: FaCog, path: '/admin/settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname === '/admin' && path === '/admin/dashboard';
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/admin':
      case '/admin/dashboard':
        return 'Admin Dashboard';
      case '/admin/productlist':
        return 'Products';
      case '/admin/product/add':
        return 'Add Product';
      case '/admin/userlist':
        return 'Users';
      case '/admin/user/add':
        return 'Add User';
      case '/admin/orderlist':
        return 'Orders';
      case '/admin/analytics':
        return 'Analytics';
      case '/admin/settings':
        return 'Settings';
      default:
        // Handle dynamic routes like /admin/product/:id/edit, /admin/user/:id/edit, /admin/order/:id/view, /admin/order/:id/edit
        if (pathname.includes('/admin/product/') && pathname.includes('/edit')) {
          return 'Edit Product';
        }
        if (pathname.includes('/admin/user/') && pathname.includes('/edit')) {
          return 'Edit User';
        }
        if (pathname.includes('/admin/order/') && pathname.includes('/view')) {
          return 'View Order';
        }
        if (pathname.includes('/admin/order/') && pathname.includes('/edit')) {
          return 'Edit Order';
        }
        return 'Admin Panel';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <div 
        className={`admin-sidebar bg-gray-900 flex flex-col ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`admin-nav-item flex items-center px-4 py-3 mb-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-lg ${
                isActive(item.path) 
                  ? 'bg-gray-800 text-white border-r-4 border-blue-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              <item.icon className="mr-3 w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="w-full p-6 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userInfo?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{userInfo?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={logoutHandler}
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <FaSignOutAlt className="mr-3 w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content min-h-screen">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{getPageTitle(location.pathname)}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {/* Welcome back, {userInfo?.name || 'Admin User'} */}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/userlist" element={<UserListScreen />} />
            <Route path="/user/add" element={<UserAddScreen />} />
            <Route path="/user/:id/edit" element={<UserEditScreen />} />
            <Route path="/productlist" element={<ProductListScreen />} />
            <Route path="/product/add" element={<ProductAddScreen />} />
            <Route path="/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="/orderlist" element={<OrderListScreen />} />
            <Route path="/order/:id/view" element={<OrderViewScreen />} />
            <Route path="/order/:id/edit" element={<OrderEditScreen />} />
            <Route path="/analytics" element={<AnalyticsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
