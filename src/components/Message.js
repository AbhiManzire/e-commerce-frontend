import React from 'react';

const Message = ({ variant, children }) => {
  const getAlertClasses = (variant) => {
    switch (variant) {
      case 'danger':
        return 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
      case 'success':
        return 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded';
      case 'warning':
        return 'bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded';
      case 'info':
        return 'bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded';
      default:
        return 'bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded';
    }
  };

  return (
    <div className={getAlertClasses(variant)}>
      {children}
    </div>
  );
};

export default Message;
