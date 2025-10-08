import React, { useState } from 'react';
import { FaTimes, FaHome, FaUsers, FaBriefcase, FaMapMarkerAlt, FaLock, FaCheck } from 'react-icons/fa';

const AddAddressModal = ({ isOpen, onClose, onSave, userPhone }) => {
  const [formData, setFormData] = useState({
    houseNumber: '',
    locality: '',
    pincode: '',
    city: '',
    state: '',
    fullName: '',
    email: '',
    saveAs: 'Home'
  });

  const [errors, setErrors] = useState({});

  const saveAsOptions = [
    { value: 'Home', label: 'Home', icon: FaHome },
    { value: 'Friends/family', label: 'Friends/family', icon: FaUsers },
    { value: 'Work', label: 'Work', icon: FaBriefcase },
    { value: 'Other', label: 'Other', icon: FaMapMarkerAlt }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.houseNumber.trim()) newErrors.houseNumber = 'House number is required';
    if (!formData.locality.trim()) newErrors.locality = 'Locality is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Pincode validation (6 digits)
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      // Reset form
      setFormData({
        houseNumber: '',
        locality: '',
        pincode: '',
        city: '',
        state: '',
        fullName: '',
        email: '',
        saveAs: 'Home'
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add new address</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Delivery Address */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">DELIVERY ADDRESS</h3>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                  placeholder="HOUSE NO, BUILDING, ROAD, AREA *"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.houseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.houseNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleInputChange}
                  placeholder="LOCALITY *"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.locality ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.locality && (
                  <p className="text-red-500 text-xs mt-1">{errors.locality}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="PINCODE *"
                  maxLength="6"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="CITY *"
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="STATE *"
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">RECIPIENT</h3>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-sm">🇮🇳</span>
                  <span className="text-sm text-gray-600">+91</span>
                </div>
                <input
                  type="text"
                  value={userPhone}
                  readOnly
                  className="w-full pl-16 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaCheck className="text-green-500" />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="FULL NAME *"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="EMAIL *"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Save As */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">SAVE AS</h3>
            <div className="grid grid-cols-2 gap-3">
              {saveAsOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, saveAs: option.value }))}
                    className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      formData.saveAs === option.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <IconComponent className="text-sm" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Information */}
          <div className="flex items-start space-x-2 text-xs text-gray-600">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              This address will be secured with OTP on Shopflo checkouts. View{' '}
              <span className="text-blue-600 underline cursor-pointer">Terms and conditions</span>{' '}
              and{' '}
              <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>

          {/* Save and Continue Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Save and continue
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <FaLock className="text-gray-400" />
            <span>Secured by Shopflo</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
