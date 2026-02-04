import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profileRefresh: Date.now()
}

const refreshSlice = createSlice({
    name: "refresh",
    initialState,
    reducers: {
        refreshProfileImage: (state) => {
            state.profileRefresh = Date.now();
        },
    }
});

export const { refreshProfileImage } = refreshSlice.actions;
export default refreshSlice.reducer;