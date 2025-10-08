import React from 'react';

import Meta from '../components/Meta';

const PlaceOrderScreen = () => {
  return (
    <>
      <Meta title="Place Order | MearnSneakers" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-4">Place Order</h2>
            <p className="text-gray-600">Order placement coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
