import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../store/slices/orderSlice';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaBox, FaUser, FaCalendar, FaPhone, FaEnvelope } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const OrderViewScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
    }
  }, [dispatch, id]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getStatusBadge = useCallback((order) => {
    if (order.isDelivered) {
      return 'bg-green-100 text-green-800';
    } else if (order.isPaid) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  }, []);

  const getStatusText = useCallback((order) => {
    if (order.isDelivered) {
      return 'Delivered';
    } else if (order.isPaid) {
      return 'Processing';
    } else {
      return 'Pending';
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  if (!order) {
    return <Message variant="danger">Order not found</Message>;
  }

  return (
    <>
      <Meta title="Order Details | MearnSneakers Admin" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/orderlist')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(order)}`}>
                  {getStatusText(order)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaBox className="mr-2 text-blue-600" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{((item.price || 0) * (item.qty || 0)).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">₹{(item.price || 0).toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    {order.user?.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Shipping Address
              </h3>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress?.fullName || 'N/A'}</p>
                <p>{order.shippingAddress?.address || 'N/A'}</p>
                <p>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.postalCode || 'N/A'}</p>
                <p>{order.shippingAddress?.country || 'N/A'}</p>
                {order.shippingAddress?.phone && (
                  <p className="mt-2 flex items-center">
                    <FaPhone className="mr-2 text-gray-400" />
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({order.orderItems?.length || 0})</span>
                  <span>₹{order.orderItems?.reduce((acc, item) => acc + (item.price * item.qty), 0)?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice?.toLocaleString() || '0'}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span>₹{order.taxPrice?.toLocaleString() || '0'}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{order.totalPrice?.toLocaleString() || '0'}</span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaCreditCard className="mr-2 text-blue-600" />
                  Payment Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium">{order.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid On</span>
                      <span className="font-medium">{formatDate(order.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaCalendar className="mr-2 text-blue-600" />
                  Order Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Placed</p>
                      <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  {order.isPaid && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment Received</p>
                        <p className="text-xs text-gray-600">{formatDate(order.paidAt)}</p>
                      </div>
                    </div>
                  )}
                  {order.isDelivered && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delivered</p>
                        <p className="text-xs text-gray-600">{formatDate(order.deliveredAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderViewScreen;
