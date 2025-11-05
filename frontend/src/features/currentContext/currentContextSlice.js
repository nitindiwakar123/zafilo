import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentDirectoryId: null
};

const currentContextSlice = createSlice({
    name: "currentContext",
    initialState,
    reducers: {
        setCurrentDirectoryId: (state, action) => {
            state.currentDirectoryId = action.payload;
        },
    }
});

export const { setCurrentDirectoryId } = currentContextSlice.actions;

export default currentContextSlice.reducer;