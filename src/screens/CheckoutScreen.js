import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCreditCard, FaMobile, FaMapMarkerAlt, FaShoppingCart } from 'react-icons/fa';
import { createOrder, createMockOrder, updateMockOrderPayment } from '../store/slices/orderSlice';
import { clearCart, saveShippingAddress } from '../store/slices/cartSlice';
import Payment from '../components/Payment';
import PaymentModal from '../components/PaymentModal';
import Meta from '../components/Meta';

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const { order, loading, error, success } = useSelector((state) => state.order);

  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Calculate totals
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // 18% GST
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    if (!userInfo) {
      navigate('/mobile-login?redirect=checkout');
    }
  }, [userInfo, navigate]);

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

  useEffect(() => {
    if (success && order) {
      setCurrentOrder(order);
      setShowPayment(true);
    }
  }, [success, order]);

  const handlePlaceOrder = async () => {
    if (!shippingAddress.address) {
      toast.error('Please add shipping address');
      return;
    }

    // Show payment modal instead of directly creating order
    setShowPaymentModal(true);
  };

  const handleProceedToPay = async () => {
    // Ensure paymentMethod is always a string
    const paymentMethodValue = typeof paymentMethod === 'string' 
      ? paymentMethod 
      : paymentMethod?.method || 'mobile_otp';

    const orderData = {
      orderItems: cartItems,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethodValue,
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice
    };

    console.log('🔄 Creating order with paymentMethod:', paymentMethodValue);
    console.log('📦 Order data:', orderData);

    // Create real order in database
    dispatch(createOrder(orderData));
    setShowPaymentModal(false);
  };

  const handlePaymentSuccess = (paymentData) => {
    // For real orders, payment is handled by the payment component
    // The order is already created and will be updated with payment info
    toast.success('Order placed successfully!');
    dispatch(clearCart());
    navigate(`/order/${currentOrder._id}`);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setCurrentOrder(null);
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
          <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to proceed with checkout</p>
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

  if (showPayment && currentOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Meta title="Payment - MearnSneakers" />
        <Payment
          orderId={currentOrder._id}
          totalAmount={totalPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Meta title="Checkout - MearnSneakers" />
      
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Go Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Items ({cartItems.length})</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
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
            {shippingAddress.address ? (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                <p>{shippingAddress.country}</p>
                <p className="mt-2">Phone: {shippingAddress.phone}</p>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                <p>No shipping address added</p>
                <button
                  onClick={() => navigate('/shipping')}
                  className="text-blue-600 hover:text-blue-800 mt-1"
                >
                  Add shipping address
                </button>
              </div>
            )}
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
                <p className="font-medium text-gray-900">Mobile Payment</p>
                <p className="text-sm text-gray-600">Pay with OTP verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="lg:sticky lg:top-4 lg:self-start lg:h-fit lg:z-10">
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Total</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({cartItems.length})</span>
                <span>₹{itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST 18%)</span>
                <span>₹{taxPrice.toLocaleString()}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !shippingAddress.address}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaMobile className="mr-2" />
                  Proceed to Payment
                </>
              )}
            </button>


            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderTotal={totalPrice}
        originalPrice={Math.round(totalPrice * 1.2)}
        userInfo={userInfo}
        onLogout={handleLogout}
        onProceedToPay={handleProceedToPay}
        cartItems={cartItems}
      />
    </div>
  );
};

export default CheckoutScreen;
