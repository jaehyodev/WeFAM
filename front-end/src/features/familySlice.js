// Redux에서 familySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  familyNick: "",
  familyMotto: "",
  profileImage: null,
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    updateFamilyNick: (state, action) => {
      state.familyNick = action.payload;
    },
    updateFamilyMotto: (state, action) => {
      state.familyMotto = action.payload;
    },
    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
    }
  }
});

export const { updateFamilyNick, updateFamilyMotto, updateProfileImage } = familySlice.actions;
export default familySlice.reducer;
