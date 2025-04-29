import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: true,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getProfileData: (state, action) => {
            state.user = action.payload.user;
            state.loading = false
        },
    },
});

export const { getProfileData } = profileSlice.actions;
export default profileSlice.reducer;
