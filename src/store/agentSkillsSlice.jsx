import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the Agent Skills slice.
 * @type {{ label: Object|null, loading: boolean }}
 */
const initialState = {
    label: null,     // Stores the label's Agent Skills data
    loading: true,  // Indicates whether the Agent Skills is being fetched
};

/**
 * Redux slice to manage the label Agent Skills.
 */
const agentSkillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        /**
         * Set label AgentSkills data after fetching it.
         *
         * @param {Object} state - Current AgentSkills state.
         * @param {Object} action - Redux action object.
         * @param {Object} action.payload - The fetched label AgentSkills data.
         */
        getAgentSkillsData: (state, action) => {
            state.label = action.payload;
            state.loading = false;
        },
        /**
     * Clear label and token on logout.
     * @param {Object} state - Current state.
     */
        discardSkillsData: (state) => {
            state.label = null;
            state.loading = true;
        }
    },
});

// Export action creator for setting AgentSkills data
export const { getAgentSkillsData, discardSkillsData } = agentSkillsSlice.actions;

// Export the reducer to be included in the store
export default agentSkillsSlice.reducer;
