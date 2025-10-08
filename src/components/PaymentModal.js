import React, { useState } from 'react';
import { FaArrowLeft, FaChevronDown, FaTruck, FaPlus, FaLock, FaGift, FaUser, FaSignOutAlt } from 'react-icons/fa';
import AddAddressModal from './AddAddressModal';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  orderTotal, 
  originalPrice, 
  userInfo, 
  onLogout, 
  onProceedToPay,
  cartItems = []
}) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  if (!isOpen) return null;

  const handleAddAddress = (addressData) => {
    setSavedAddresses([...savedAddresses, addressData]);
    setShowAddressModal(false);
  };

  const handleProceedToPay = () => {
    if (savedAddresses.length === 0) {
      setShowAddressModal(true);
      return;
    }
    onProceedToPay();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <FaArrowLeft className="text-lg" />
            </button>
            <h1 className="text-lg font-bold">CREPDOG CREW</h1>
            <div className="text-right">
              <div className="text-sm text-gray-600">Order total</div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">₹{orderTotal?.toLocaleString()}</span>
                {originalPrice && originalPrice > orderTotal && (
                  <>
                    <span className="text-sm text-gray-500 line-through">₹{originalPrice?.toLocaleString()}</span>
                    <button 
                      onClick={() => setShowOrderDetails(!showOrderDetails)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <FaChevronDown className={`text-xs transition-transform ${showOrderDetails ? 'rotate-180' : ''}`} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Details Dropdown */}
          {showOrderDetails && (
            <div className="px-4 py-3 bg-gray-50 border-b">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{((cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0) * 0.18)).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">-₹{originalPrice ? (originalPrice - orderTotal).toLocaleString() : 0}</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-6">
            {/* Offers & Rewards */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Offers & Rewards</h3>
              <button className="w-full flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <FaGift className="text-green-600" />
                  <span className="text-green-800 font-medium">Coupons</span>
                </div>
                <FaChevronDown className="text-green-600" />
              </button>
            </div>

            {/* Delivery */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                  <FaTruck className="mr-2" />
                  Delivery
                </h3>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  className="text-sm text-blue-600 flex items-center hover:text-blue-800"
                >
                  Add new
                  <FaPlus className="ml-1 text-xs" />
                </button>
              </div>
              
              {savedAddresses.length > 0 ? (
                <div className="space-y-2">
                  {savedAddresses.map((address, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{address.fullName}</p>
                          <p className="text-xs text-gray-600">{address.address}</p>
                          <p className="text-xs text-gray-600">{address.city}, {address.pincode}</p>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{address.saveAs}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-gray-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600">No saved addresses</p>
                </div>
              )}
            </div>

            {/* Account & Preferences */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={newsletterOptIn}
                  onChange={(e) => setNewsletterOptIn(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  Keep me posted about sales and offers
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Logged in with {userInfo?.phone || '+91 87665 19507'}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  Log out
                  <FaSignOutAlt className="ml-1 text-xs" />
                </button>
              </div>
            </div>

            {/* Proceed to Pay Button */}
            <button
              onClick={handleProceedToPay}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Proceed to Pay
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <FaLock className="text-gray-400" />
              <span>Secured by shopflo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleAddAddress}
        userPhone={userInfo?.phone || '+91 87665 19507'}
      />
    </>
  );
};

export default PaymentModal;
