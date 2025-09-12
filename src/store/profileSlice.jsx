import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the profile slice.
 * @type {{ user: Object|null, loading: boolean }}
 */
const initialState = {
    user: null,     // Stores the user's profile data
    loading: true,  // Indicates whether the profile is being fetched
};

/**
 * Redux slice to manage the user profile.
 */
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        /**
         * Set user profile data after fetching it.
         *
         * @param {Object} state - Current profile state.
         * @param {Object} action - Redux action object.
         * @param {Object} action.payload - The fetched user profile data.
         */
        getProfileData: (state, action) => {
            state.user = action.payload;
            state.user.subscriptionDurationType = state.user.subscriptionDurationType || "monthly";
            state.loading = false;
        },
        /**
     * Clear user and token on logout.
     * @param {Object} state - Current state.
     */
        discardData: (state) => {
            state.user = null;
            state.loading = true;
        }
    },
});

// Export action creator for setting profile data
export const { getProfileData,discardData } = profileSlice.actions;

// Export the reducer to be included in the store
export default profileSlice.reducer;
