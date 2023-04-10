import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {ArrayLocalStorageKey} from "../../Constants/Constants";
export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    data: []
  },
  reducers: {
    increment: (state,action) => {
      console.log(action);
      state.data[action.payload] +=1
      state.data = [...state.data];
      localStorage.setItem(ArrayLocalStorageKey, JSON.stringify(state.data));
    },
    decrement: (state, action) => {
      console.log(action);
      state.data[action.payload] -=1
      state.data = [...state.data];
      localStorage.setItem(ArrayLocalStorageKey, JSON.stringify(state.data));
    },
    setInitialState: (state, action) => {
      state.data = action.payload;
    }

  },
});

export const { increment, decrement, setInitialState } = counterSlice.actions;

export const selectItems = (state) => state.counter.data;
export default counterSlice.reducer;
