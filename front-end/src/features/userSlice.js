// src/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {
      familyIdx: null, // 카카오 로그인에서 받은 값에 새로 추가
    },
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload }; // 기존 데이터에 새 데이터 병합
    },
  },
});

export const { setUserData, updateUserData } = userSlice.actions;

export default userSlice.reducer;
