import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const initialState = {
  contributions: [],
  status: 'idle',
  error: null,
};

export const addContribution = createAsyncThunk('contributions/addContribution', async (newContribution, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/contributions/', newContribution);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data.non_field_errors[0]);
  }
});

export const fetchStoryContributions = createAsyncThunk('contributions/fetchStoryContributions', async (storyId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/story/${storyId}/contributions/`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data['detail'])
  }
});

export const updateContribution = createAsyncThunk('contributions/updateContribution', async ({ id, updatedContribution }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/contributions/${id}/`, updatedContribution);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data.non_field_errors[0]);
  }
});

export const deleteContribution = createAsyncThunk('contributions/deleteContribution', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/contributions/${id}/`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data.detail)
  }
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
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchStoryContributions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStoryContributions.fulfilled, (state, action) => {
        state.contributions = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchStoryContributions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateContribution.fulfilled, (state, action) => {
        const index = state.contributions.findIndex(contribution => contribution.id === action.payload.id);
        if (index !== -1) {
          state.contributions[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateContribution.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteContribution.fulfilled, (state, action) => {
        state.contributions = state.contributions.filter(contribution => contribution.id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(deleteContribution.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contributionSlice.reducer;
