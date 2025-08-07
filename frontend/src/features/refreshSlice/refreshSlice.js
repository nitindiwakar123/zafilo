import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isRefresh: false
}

const refreshSlice = createSlice({
    name: "refresh",
    initialState,
    reducers: {
        refresh: (state) => {
            state.isRefresh = !state.isRefresh;
        } 
    }
});

export const { refresh } = refreshSlice.actions;
export default refreshSlice.reducer;