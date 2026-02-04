import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userId: null,
    loading: true,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userId = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.status = false;
            state.userId = null;
            state.loading = false;
        }        
    }
});


export const {login, logout} = authSlice.actions;

export default authSlice.reducer;