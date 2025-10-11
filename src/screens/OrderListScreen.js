import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaShoppingCart
} from 'react-icons/fa';
import { fetchAllOrders } from '../store/slices/orderSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders, loading, error } = useSelector((state) => state.order);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Fetch orders on component mount only
  useEffect(() => {
    console.log('🔄 OrderListScreen: Fetching orders...');
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/order/${orderId}/view`);
  };

  const handleEditOrder = (orderId) => {
    navigate(`/admin/order/${orderId}/edit`);
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete order #${orderNumber}?`)) {
      // TODO: Implement order deletion
      toast.info('Order deletion functionality coming soon!');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (order) => {
    if (order.isDelivered) {
      return 'bg-green-100 text-green-800';
    } else if (order.isPaid) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (order) => {
    if (order.isDelivered) {
      return 'Delivered';
    } else if (order.isPaid) {
      return 'Processing';
    } else {
      return 'Pending';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        (order.user && order.user.name && order.user.name.toLowerCase().includes(searchLower)) ||
        (order.user && order.user.email && order.user.email.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  return (
    <>
      <Meta title="Order Management | MearnSneakers Admin" />
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <select 
              value={selectedStatus}
              onChange={handleStatusChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user ? order.user.name : 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user ? order.user.email : 'No email'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.totalPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order)}`}>
                            {getStatusText(order)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewOrder(order._id)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View Order"
                            >
                              <FaEye />
                            </button>
                            <button 
                              onClick={() => handleEditOrder(order._id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Edit Order"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteOrder(order._id, order._id.slice(-6).toUpperCase())}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Delete Order"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <FaShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                          <p className="text-gray-500">
                            {searchTerm || selectedStatus !== '' 
                              ? 'Try adjusting your search or filter criteria.' 
                              : 'No orders have been placed yet.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderListScreen;
