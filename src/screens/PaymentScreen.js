import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { saveShippingAddress } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import PaymentModal from '../components/PaymentModal';
import Payment from '../components/Payment';
import Meta from '../components/Meta';

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const { order } = useSelector((state) => state.order);

  const [showPaymentModal, setShowPaymentModal] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  // Calculate totals
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // 18% GST
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  
  // Mock original price (20% higher for demonstration)
  const originalPrice = Math.round(totalPrice * 1.2);

  // Add default shipping address for testing if none exists
  useEffect(() => {
    if (userInfo && (!shippingAddress.address || Object.keys(shippingAddress).length === 0)) {
      const defaultAddress = {
        fullName: userInfo.name || 'Test User',
        address: '123 Test Street, Test Area',
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India',
        phone: userInfo.phone || '9876543210'
      };
      dispatch(saveShippingAddress(defaultAddress));
      toast.info('Default shipping address added for testing');
    }
  }, [userInfo, shippingAddress, dispatch]);

  const handleProceedToPay = () => {
    // Create real order in database
    const orderData = {
      orderItems: cartItems,
      shippingAddress: shippingAddress,
      paymentMethod: 'mobile_otp', // Always use string value
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice
    };

    console.log('🔄 PaymentScreen: Creating order with data:', orderData);
    dispatch(createOrder(orderData));
    setShowPaymentModal(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    toast.success('Order placed successfully!');
    navigate('/order/' + order._id);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setShowPaymentModal(true);
  };

  const handleLogout = () => {
    // Handle logout logic here
    toast.info('Logged out successfully');
    navigate('/mobile-login');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to proceed with payment</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (showPayment && order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Meta title="Payment - MearnSneakers" />
        <Payment
          orderId={order._id}
          totalAmount={totalPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <>
      <Meta title="Payment | MearnSneakers" />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => navigate(-1)}
        orderTotal={totalPrice}
        originalPrice={originalPrice}
        userInfo={userInfo}
        onLogout={handleLogout}
        onProceedToPay={handleProceedToPay}
        cartItems={cartItems}
      />
    </>
  );
};

export default PaymentScreen;
