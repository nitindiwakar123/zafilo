import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    openMenu: null
}

const menuContextSlice = createSlice({
    name: "menuContext",
    initialState,
    reducers: {
        setOpenMenu: (state, action) => {
            state.openMenu = action.payload;
        }
    }
});

export const { setOpenMenu } = menuContextSlice.actions;
export default menuContextSlice.reducer;