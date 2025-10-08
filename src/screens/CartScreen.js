import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../store/slices/cartSlice';
import Message from '../components/Message';
import Meta from '../components/Meta';

const CartScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);

  const removeFromCartHandler = (id, size, color) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/mobile-login?redirect=checkout');
    }
  };

  return (
    <>
      <Meta title="Shopping Cart | MearnSneakers" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <Message>
                Your cart is empty <Link to="/" className="text-blue-600 hover:text-blue-500">Go Back</Link>
              </Message>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.size}-${item.color || 'default'}`} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-1">
                        <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded" />
                      </div>
                      <div className="md:col-span-1">
                        <Link to={`/product/${item._id}`} className="text-blue-600 hover:text-blue-500 font-medium">
                          {item.name}
                        </Link>
                      </div>
                      <div className="md:col-span-1 font-semibold">${item.price}</div>
                      <div className="md:col-span-1">
                        <select
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              updateCartItemQuantity({
                                id: item._id,
                                size: item.size,
                                color: item.color,
                                qty: Number(e.target.value),
                              })
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between">
                          <div className="text-gray-600">
                            <div>Size: {item.size}</div>
                            {item.color && <div>Color: {item.color}</div>}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCartHandler(item._id, item.size, item.color)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-semibold">
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                </h2>
                <p className="text-2xl font-bold text-gray-900">
                  ${cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </p>
              </div>
              
              <button
                type="button"
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartScreen;
