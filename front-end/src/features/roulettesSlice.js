import { createSlice } from "@reduxjs/toolkit";

const roulettesSlice = createSlice({
  name: "roulettes",
  initialState: {
    roulettes: [],
  },
  reducers: {
    addRoulette: (state, action) => {
      state.roulettes.push(action.payload);
    },
    deleteRoulette: (state, action) => {
      const { rouletteId } = action.payload;
      state.roulettes = state.roulettes.filter(
        (roulette) => roulette.id !== rouletteId
      );
    },
    clearRoulettes: (state) => {
      state.roulettes = [];
    },
  },
});

export const { addRoulette, deleteRoulette, clearRoulettes } =
  roulettesSlice.actions;
export default roulettesSlice.reducer;
