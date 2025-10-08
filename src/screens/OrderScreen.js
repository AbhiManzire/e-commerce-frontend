import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaMapMarkerAlt, FaMobile, FaCheckCircle, FaTimesCircle, FaClock, FaTruck, FaBox } from 'react-icons/fa';
import { getOrderById, clearOrder } from '../store/slices/orderSlice';
import Meta from '../components/Meta';

const OrderScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      // Check if it's a mock order and if it's already in the Redux store
      if (id.startsWith('mock-order-') && order && order._id === id) {
        // Order is already in Redux store, no need to fetch
        console.log('Mock order already in Redux store:', order);
        return;
      }
      
      // Always try to fetch the order (handles both real and mock orders)
      dispatch(getOrderById(id));
    }
    return () => {
      // Don't clear order on unmount for mock orders to preserve state
      if (!id || !id.startsWith('mock-order-')) {
        dispatch(clearOrder());
      }
    };
  }, [dispatch, id, order]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'processing':
        return <FaBox className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <FaTimesCircle className="text-6xl text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta title={`Order ${order._id} | MearnSneakers`} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
              <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || 'pending')}`}>
                {getStatusIcon(order.status || 'pending')}
                <span className="ml-2 capitalize">{order.status || 'Pending'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Qty: {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName || 'N/A'}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaMobile className="mr-2 text-green-600" />
                Payment Method
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaMobile className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {typeof order.paymentMethod === 'string' 
                      ? order.paymentMethod.replace('_', ' ') 
                      : 'Mobile Payment'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.isPaid ? 'Paid' : 'Not Paid'}
                  </p>
                  {order.paidAt && (
                    <p className="text-sm text-gray-600">
                      Paid on: {new Date(order.paidAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-4 lg:self-start lg:h-fit">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({order.orderItems.length})</span>
                  <span>₹{order.itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span>₹{order.taxPrice.toLocaleString()}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{order.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.isPaid ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {order.isPaid ? <FaCheckCircle className="text-white text-sm" /> : <FaClock className="text-white text-sm" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment</p>
                      <p className="text-xs text-gray-600">
                        {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Pending'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.isDelivered ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {order.isDelivered ? <FaCheckCircle className="text-white text-sm" /> : <FaClock className="text-white text-sm" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery</p>
                      <p className="text-xs text-gray-600">
                        {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
