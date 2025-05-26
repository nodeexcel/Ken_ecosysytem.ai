import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the Navbar slice.
 * @type {{ label: Object|null, loading: boolean }}
 */
const initialState = {
    label: null,     // Stores the label's Navbar data
    loading: true,  // Indicates whether the Navbar is being fetched
};

/**
 * Redux slice to manage the label Navbar.
 */
const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        /**
         * Set label Navbar data after fetching it.
         *
         * @param {Object} state - Current Navbar state.
         * @param {Object} action - Redux action object.
         * @param {Object} action.payload - The fetched label Navbar data.
         */
        getNavbarData: (state, action) => {
            state.label = action.payload;
            state.loading = false;
        },
        /**
     * Clear label and token on logout.
     * @param {Object} state - Current state.
     */
        discardData: (state) => {
            state.label = null;
            state.loading = true;
        }
    },
});

// Export action creator for setting Navbar data
export const { getNavbarData, discardData } = navbarSlice.actions;

// Export the reducer to be included in the store
export default navbarSlice.reducer;
