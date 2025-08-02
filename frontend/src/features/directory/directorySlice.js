import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentDirectory: null
};

const directorySlice = createSlice({
    name: "directory",
    initialState,
    reducers: {
        setDirectoryData: (state, action) => {
            state.currentDirectory = action.payload;
        },
        clearDirectoryData: (state, action) => {
            state = {
                currentDirectoryId: null,
                directories: null,
                files: null
            };
        }
    }
});

export const {setDirectoryData, clearDirectoryData} = directorySlice.actions;

export default directorySlice.reducer;