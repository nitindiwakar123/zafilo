import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    directoryRefresh: false,
    userRefresh: false
}

const refreshSlice = createSlice({
    name: "refresh",
    initialState,
    reducers: {
        refreshDirectoryData: (state) => {
            state.directoryRefresh = !state.directoryRefresh;
        }, 
        refreshUserData: (state) => {
            state.userRefresh = !state.userRefresh;
        }, 
    }
});

export const { refreshDirectoryData, refreshUserData } = refreshSlice.actions;
export default refreshSlice.reducer;