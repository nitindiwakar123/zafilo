import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import directorySlice from "../features/directory/directorySlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        directory: directorySlice
    }
});

export default store;