import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import directorySlice from "../features/directory/directorySlice";
import refreshSlice from "../features/refreshSlice/refreshSlice";
import menuContextSlice from "../features/menuContextSlice/menuContextSlice";


const store = configureStore({
    reducer: {
        auth: authSlice,
        directory: directorySlice,
        refresh: refreshSlice,
        menuContext: menuContextSlice,
    }
});

export default store;