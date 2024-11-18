// src/redux/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    locationInput: '', // e.target.value 값을 저장할 state
};

const locationSlice = createSlice({
    name: 'locationInput',
    initialState,
    reducers: {
        setLocationInput: (state, action) => {
            state.locationInput  = action.payload;
        },
    },
});

export const { setLocationInput } = locationSlice.actions;

export default locationSlice.reducer;
