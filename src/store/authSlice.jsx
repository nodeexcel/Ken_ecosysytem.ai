import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial authentication state.
 * @type {{ user: Object|null, token: string|null, loading: boolean, email: string|null }}
 */
const initialState = {
  user: null,     // Authenticated user object
  token: null,    // JWT or access token
  loading: true,  // Indicates if authentication check is in progress
  email: null     // Email used in login or OTP flows
};

/**
 * Redux slice to manage authentication state.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Handle successful login.
     * @param {Object} state - Current state.
     * @param {Object} action - Redux action with payload containing user and token.
     * @param {Object} action.payload.user - Authenticated user details.
     * @param {string} action.payload.token - JWT or auth token.
     */
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },

    /**
     * Store email used during authentication (e.g. login or OTP steps).
     * @param {Object} state - Current state.
     * @param {Object} action - Redux action with payload containing the email.
     * @param {string} action.payload.email - Email address to store.
     */
    emailState: (state, action) => {
      state.email = action.payload.email;
    },

    /**
     * Clear user and token on logout.
     * @param {Object} state - Current state.
     */
    logoutState: (state) => {
      state.user = null;
      state.token = null;
      state.email = null;
    }
  },
});

// Exporting action creators
export const { loginSuccess, logoutState, emailState } = authSlice.actions;

// Exporting the reducer
export default authSlice.reducer;
