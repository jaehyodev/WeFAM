import { createSlice } from "@reduxjs/toolkit";

const pollsSlice = createSlice({
  name: "polls",
  initialState: {
    polls: [],
  },
  reducers: {
    addPoll: (state, action) => {
      state.polls.push(action.payload);
    },
    deletePoll: (state, action) => {
      const { pollId } = action.payload;
      state.polls = state.polls.filter((poll) => poll.id !== pollId);
    },
    clearPolls: (state) => {
      state.polls = [];
    },
  },
});

export const { addPoll, deletePoll, clearPolls } = pollsSlice.actions;
export default pollsSlice.reducer;
