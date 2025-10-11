import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

const userFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// Async thunks
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🔍 Login action: Attempting login for:', email);
      const response = await api.post('/api/users/login', { email, password });
      console.log('🔍 Login action: Response data:', response.data);
      console.log('🔍 Login action: isAdmin flag:', response.data.isAdmin);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('🔍 Login action: Error:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/users', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      const response = await api.get('/api/users/profile', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (user, { getState, rejectWithValue }) => {
    try {
      const { user: userState } = getState();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userState.userInfo.token}`,
        },
      };
      const response = await api.put('/api/users/profile', user, config);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin user management actions
export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('🔄 fetchAllUsers called with params:', params);
      const response = await api.get('/api/users', { params });
      console.log('📊 fetchAllUsers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ fetchAllUsers error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('🔄 fetchUserById called with userId:', userId);
      const response = await api.get(`/api/users/${userId}`);
      console.log('📊 fetchUserById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ fetchUserById error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('🔄 createUser called with data:', userData);
      const response = await api.post('/api/users', userData);
      console.log('📊 createUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ createUser error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      console.log('🔄 updateUser called with id:', id, 'data:', userData);
      const response = await api.put(`/api/users/${id}`, userData);
      console.log('📊 updateUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ updateUser error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 deleteUser called with id:', id);
      await api.delete(`/api/users/${id}`);
      console.log('📊 deleteUser success');
      return id;
    } catch (error) {
      console.error('❌ deleteUser error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  userInfo: userFromStorage,
  users: [], // For admin user management
  selectedUser: null, // For editing a specific user
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    mobileLogin: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // Get profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = { ...state.userInfo, ...action.payload };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get profile';
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })
      // Fetch all users (admin)
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        console.log('🎯 Redux: fetchAllUsers.fulfilled');
        console.log('📦 Redux: Action payload:', action.payload);
        state.users = Array.isArray(action.payload) ? action.payload : [];
        console.log('✅ Redux: Users state updated successfully');
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        console.error('❌ Redux: fetchAllUsers.rejected');
        console.error('❌ Redux: Error payload:', action.payload);
        state.error = action.payload?.message || 'Failed to fetch users';
      })
      // Fetch user by ID (admin)
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      })
      // Create user (admin)
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create user';
      })
      // Update user (admin)
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update user';
      })
      // Delete user (admin)
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete user';
      });
  },
});

export const { logout, clearError, clearSuccess, mobileLogin } = userSlice.actions;
export default userSlice.reducer;
