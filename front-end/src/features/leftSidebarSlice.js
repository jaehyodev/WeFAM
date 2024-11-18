import { createSlice } from "@reduxjs/toolkit";

const leftSidebarSlice = createSlice({
  name: "leftSidebar",
  initialState: {
    isOpen: true,
  },
  reducers: {
    toggleLeftSidebar: (state) => {
      state.isOpen = !state.isOpen;
      console.log(state.isOpen);
    },
  },
});

export const { toggleLeftSidebar } = leftSidebarSlice.actions;
export default leftSidebarSlice.reducer;
