import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mobileLogin } from '../store/slices/userSlice';
import MobileOTPLogin from '../components/MobileOTPLogin';
import Meta from '../components/Meta';

const MobileLoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? `/${location.search.split('=')[1]}` : '/';

  const handleLoginSuccess = (userData) => {
    // Dispatch mobile login action to update Redux store
    dispatch(mobileLogin(userData));
    
    // Navigate to the intended page
    navigate(redirect);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <Meta title="Mobile Login | MearnSneakers" />
      <MobileOTPLogin
        onLoginSuccess={handleLoginSuccess}
        onCancel={handleCancel}
        redirect={redirect}
      />
    </>
  );
};

export default MobileLoginScreen;
