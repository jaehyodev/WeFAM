import { createSlice } from "@reduxjs/toolkit";

const imagesOnFeedSlice = createSlice({
  name: "imagesOnFeed",
  initialState: {
    images: [],
  },
  reducers: {
    addImage: (state, action) => {
      const { url, file } = action.payload;
      const { name, size } = file;
      const ext = name.split(".").pop();

      // 이건 위에 변수 없이 저장할 떄 사용
      // state.images.push(action.payload);

      state.images.push({
        url,
        name: name,
        size: size,
        ext: ext,
      });
    },
    clearImages: (state) => {
      state.images = [];
    },
  },
});

export const { addImage, clearImages } = imagesOnFeedSlice.actions;

export default imagesOnFeedSlice.reducer;