import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    directoryRefresh: false,
    userRefresh: false,
    profileRefresh: Date.now()
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
        refreshProfileImage: (state) => {
            state.profileRefresh = Date.now();
        }, 
    }
});

export const { refreshDirectoryData, refreshUserData, refreshProfileImage } = refreshSlice.actions;
export default refreshSlice.reducer;