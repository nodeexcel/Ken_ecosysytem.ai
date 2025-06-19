import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the Country slice.
 * @type {{ label: Object|null, loading: boolean }}
 */
const initialState = {
    data: null,     // Stores the label's Country data
    loading: true,  // Indicates whether the Country is being fetched
};

/**
 * Redux slice to manage the label Country.
 */
const countryCodeSlice = createSlice({
    name: 'countryCode',
    initialState,
    reducers: {
        /**
         * Set label Country data after fetching it.
         *
         * @param {Object} state - Current Country state.
         * @param {Object} action - Redux action object.
         * @param {Object} action.payload - The fetched label Country data.
         */
        getCountryData: (state, action) => {
            state.data = action.payload;
            state.loading = false;
        },
        /**
     * Clear label and token on logout.
     * @param {Object} state - Current state.
     */
        discardData: (state) => {
            state.data = null;
            state.loading = true;
        }
    },
});

// Export action creator for setting Country data
export const { getCountryData, discardData } = countryCodeSlice.actions;

// Export the reducer to be included in the store
export default countryCodeSlice.reducer;
