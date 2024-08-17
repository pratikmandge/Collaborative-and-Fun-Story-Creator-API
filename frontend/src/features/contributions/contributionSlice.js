import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const initialState = {
  contributions: [],
  status: 'idle',
  error: null,
};

export const addContribution = createAsyncThunk('contributions/addContribution', async (newContribution) => {
  const response = await api.post('/api/contributions/', newContribution);
  return response.data;
});

const contributionSlice = createSlice({
  name: 'contributions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addContribution.fulfilled, (state, action) => {
        state.contributions.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(addContribution.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contributionSlice.reducer;
