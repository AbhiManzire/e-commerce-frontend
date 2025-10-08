import React, { useState, useEffect } from 'react';
import { FaMobile, FaShieldAlt, FaCheckCircle, FaClock, FaArrowLeft } from 'react-icons/fa';

const MobileOTPLogin = ({ onLoginSuccess, onCancel, redirect = '/' }) => {
  const [step, setStep] = useState(1); // 1: Mobile Input, 2: OTP Verification, 3: Success
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);

  // Timer for OTP expiration
  useEffect(() => {
    let timer;
    if (otpExpiresIn > 0) {
      timer = setInterval(() => {
        setOtpExpiresIn((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpExpiresIn]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    
    if (!mobileNumber || mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful OTP send
      setOtpExpiresIn(300); // 5 minutes
      setStep(2);
      alert(`OTP sent to +91 ${mobileNumber}\n\nFor testing, use OTP: 123456`);
    } catch (error) {
      console.error('OTP send error:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for dummy OTP
      if (otp === '123456') {
        // Mock successful OTP verification
        setStep(3);
        alert('Login successful!');
        
        // Simulate user data
        const mockUserData = {
          _id: 'user123',
          name: 'Test User',
          phone: mobileNumber,
          email: `${mobileNumber}@example.com`,
          token: 'mock-jwt-token'
        };
        
        setTimeout(() => {
          onLoginSuccess(mockUserData);
        }, 2000);
      } else {
        // Invalid OTP
        setOtpAttempts(prev => prev + 1);
        alert('Invalid OTP. For testing, use: 123456');
        setOtp('');
        
        if (otpAttempts >= 2) {
          alert('Maximum OTP attempts exceeded. Please try again.');
          setStep(1);
          setOtpAttempts(0);
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpAttempts(prev => prev + 1);
      alert('Invalid OTP. For testing, use: 123456');
      setOtp('');
      
      if (otpAttempts >= 2) {
        alert('Maximum OTP attempts exceeded. Please try again.');
        setStep(1);
        setOtpAttempts(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpExpiresIn(300);
      setOtp('');
      alert(`OTP resent to +91 ${mobileNumber}\n\nFor testing, use OTP: 123456`);
    } catch (error) {
      console.error('Resend OTP error:', error);
      alert('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp('');
      setOtpAttempts(0);
    } else if (step === 1) {
      onCancel();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {step === 1 && <FaMobile className="text-4xl text-blue-600" />}
                {step === 2 && <FaShieldAlt className="text-4xl text-green-600" />}
                {step === 3 && <FaCheckCircle className="text-4xl text-green-600" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {step === 1 && 'Login with Mobile'}
                {step === 2 && 'Verify OTP'}
                {step === 3 && 'Login Successful'}
              </h2>
              <p className="text-gray-600">
                {step === 1 && 'Enter your mobile number to receive OTP'}
                {step === 2 && 'Enter the 6-digit OTP sent to your mobile'}
                {step === 3 && 'You have been logged in successfully'}
              </p>
            </div>

            {/* Back Button */}
            <div className="mb-4">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
            </div>

            {step === 1 && (
              <form onSubmit={handleMobileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter any 10-digit number"
                      maxLength="10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    For testing: Use any 10-digit number (e.g., 9876543210)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || mobileNumber.length !== 10}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="123456"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    For testing: Use OTP <span className="font-bold text-blue-600">123456</span>
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    OTP sent to +91 {mobileNumber}
                  </p>
                  {otpExpiresIn > 0 ? (
                    <p className="text-sm text-orange-600 flex items-center justify-center">
                      <FaClock className="mr-1" />
                      Expires in: {formatTime(otpExpiresIn)}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">OTP has expired</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6 || otpExpiresIn === 0}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || otpExpiresIn > 0}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-green-800 mb-1">
                    Login Successful!
                  </h3>
                  <p className="text-sm text-green-600">
                    Welcome back! Redirecting you now...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOTPLogin;
