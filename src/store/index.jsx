import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import navbarReducer from './navbarSlice'

/**
 * Configures the Redux store with application reducers.
 *
 * - `auth`: Manages authentication state (user, token, etc.).
 * - `profile`: Manages user profile state (details, updates, etc.).
 *
 * Redux Toolkit’s `configureStore` automatically:
 * - Sets up Redux DevTools (in development).
 * - Adds middleware like `redux-thunk` by default.
 *
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    navbar:navbarReducer
  },
});

export default store;
