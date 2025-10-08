import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/apiConfig';

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      const response = await api.post('http://localhost:5000/api/orders', order, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id, { getState, rejectWithValue }) => {
    try {
      // Check if it's a mock order ID
      if (id.startsWith('mock-order-')) {
        console.log('Looking for mock order:', id);
        
        // For mock orders, try to get from localStorage or return error
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        console.log('All mock orders in localStorage:', mockOrders);
        
        const mockOrder = mockOrders.find(order => order._id === id);
        console.log('Found mock order:', mockOrder);
        
        if (mockOrder) {
          return mockOrder;
        } else {
          // Also check if the order is currently in the Redux store
          const { order } = getState();
          if (order && order._id === id) {
            console.log('Found order in Redux store:', order);
            return order;
          }
          
          // If still not found, create a temporary mock order for display
          console.warn('Mock order not found, creating temporary order for display');
          const tempOrder = {
            _id: id,
            user: 'temp-user',
            orderItems: [
              {
                name: 'Sample Product',
                qty: 1,
                image: '/logo.svg',
                price: 1000,
                size: 'M'
              }
            ],
            shippingAddress: {
              fullName: 'Sample User',
              address: '123 Sample Street',
              city: 'Sample City',
              postalCode: '123456',
              country: 'India',
              phone: '9876543210'
            },
            paymentMethod: 'mobile_otp',
            itemsPrice: 1000,
            shippingPrice: 100,
            taxPrice: 180,
            totalPrice: 1280,
            isPaid: false,
            isDelivered: false,
            paidAt: null,
            deliveredAt: null,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          return tempOrder;
        }
      }

      // For real orders, fetch from API
      const { user } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      const response = await api.get(`http://localhost:5000/api/orders/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch order' });
    }
  }
);

export const payOrder = createAsyncThunk(
  'order/payOrder',
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      const response = await api.put(`http://localhost:5000/api/orders/${orderId}/pay`, paymentResult, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      const response = await api.get('http://localhost:5000/api/orders/myorders', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  order: null,
  orders: [],
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    updateMockOrderPayment: (state, action) => {
      // Update mock order payment status
      if (state.order && state.order._id.startsWith('mock-order-')) {
        state.order.isPaid = true;
        state.order.paidAt = new Date().toISOString();
        state.order.status = 'processing';
        
        // Update in localStorage as well
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        const updatedMockOrders = mockOrders.map(order => 
          order._id === state.order._id ? state.order : order
        );
        localStorage.setItem('mockOrders', JSON.stringify(updatedMockOrders));
      }
    },
    createMockOrder: (state, action) => {
      // Create a mock order for testing without API call
      const mockOrder = {
        _id: `mock-order-${Date.now()}`,
        user: action.payload.userId,
        orderItems: action.payload.orderItems,
        shippingAddress: action.payload.shippingAddress,
        paymentMethod: action.payload.paymentMethod,
        itemsPrice: action.payload.itemsPrice,
        shippingPrice: action.payload.shippingPrice,
        taxPrice: action.payload.taxPrice,
        totalPrice: action.payload.totalPrice,
        isPaid: false,
        isDelivered: false,
        paidAt: null,
        deliveredAt: null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Creating mock order:', mockOrder);
      
      // Store mock order in localStorage for later retrieval
      const existingMockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      existingMockOrders.push(mockOrder);
      localStorage.setItem('mockOrders', JSON.stringify(existingMockOrders));
      
      console.log('Stored mock orders in localStorage:', existingMockOrders);
      
      state.order = mockOrder;
      state.loading = false;
      state.error = null;
      state.success = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create order';
      })
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get order';
      })
      // Pay order
      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to pay order';
      })
      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get orders';
      });
  },
});

export const { clearOrder, clearError, clearSuccess, createMockOrder, updateMockOrderPayment } = orderSlice.actions;
export default orderSlice.reducer;
