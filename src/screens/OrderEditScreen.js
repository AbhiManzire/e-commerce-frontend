import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, payOrder, updateOrder } from '../store/slices/orderSlice';
import { FaArrowLeft, FaSave, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const OrderEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({
    isPaid: false,
    isDelivered: false,
    status: 'pending'
  });

  useEffect(() => {
    if (id) {
      dispatch(getOrderById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (order && order._id) {
      setFormData({
        isPaid: order.isPaid || false,
        isDelivered: order.isDelivered || false,
        status: order.status || 'pending'
      });
    }
  }, [order]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateOrder({ 
        orderId: order._id, 
        updateData: formData 
      })).unwrap();
      toast.success('Order updated successfully!');
      navigate('/admin/orderlist');
    } catch (error) {
      toast.error('Failed to update order');
    }
  }, [dispatch, order?._id, formData, navigate]);

  const handleMarkAsPaid = useCallback(async () => {
    if (window.confirm('Mark this order as paid?')) {
      try {
        await dispatch(payOrder({ 
          orderId: order._id, 
          paymentResult: { 
            id: 'admin-update', 
            status: 'completed', 
            update_time: new Date().toISOString(),
            email_address: order.user?.email 
          } 
        })).unwrap();
        toast.success('Order marked as paid!');
      } catch (error) {
        toast.error('Failed to mark order as paid');
      }
    }
  }, [dispatch, order?._id, order?.user?.email]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      <Meta title="Edit Order | MearnSneakers Admin" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/orderlist')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Order #{order._id.slice(-6).toUpperCase()}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={`#${order._id.slice(-6).toUpperCase()}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer
                </label>
                <input
                  type="text"
                  value={order.user?.name || 'N/A'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Date
                </label>
                <input
                  type="text"
                  value={formatDate(order.createdAt)}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={`₹${order.totalPrice?.toLocaleString() || '0'}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            {/* Order Status */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPaid"
                    name="isPaid"
                    checked={formData.isPaid}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-700">
                    Payment Received
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDelivered"
                    name="isDelivered"
                    checked={formData.isDelivered}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDelivered" className="ml-2 block text-sm text-gray-700">
                    Order Delivered
                  </label>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex space-x-4">
                {!order.isPaid && (
                  <button
                    type="button"
                    onClick={handleMarkAsPaid}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <FaCheck className="mr-2" />
                    Mark as Paid
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/admin/orderlist')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaSave className="mr-2" />
                Update Order
              </button>
            </div>
          </form>
        </div>

        {/* Order Details Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
              <p className="text-sm text-gray-600">Name: {order.user?.name || 'N/A'}</p>
              <p className="text-sm text-gray-600">Email: {order.user?.email || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-600">{order.shippingAddress?.fullName || 'N/A'}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress?.address || 'N/A'}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.postalCode || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} (Size: {item.size}, Qty: {item.qty})</span>
                  <span>₹{((item.price || 0) * (item.qty || 0)).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderEditScreen;
