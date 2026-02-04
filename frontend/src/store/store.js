import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import refreshSlice from "../features/refreshSlice/refreshSlice";
import menuContextSlice from "../features/menuContextSlice/menuContextSlice";
import currentContextSlice from "../features/currentContext/currentContextSlice";


const store = configureStore({
    reducer: {
        auth: authSlice,
        refresh: refreshSlice,
        menuContext: menuContextSlice,
        currentContext: currentContextSlice,
    }
});

export default store;