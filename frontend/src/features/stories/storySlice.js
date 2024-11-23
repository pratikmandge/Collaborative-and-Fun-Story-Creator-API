import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const initialState = {
    stories: [],
    status: 'idle',
    error: null,
};

export const fetchSingleStories = createAsyncThunk('stories/fetchSingleStories', async (storyId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/api/stories/${storyId}`);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.detail)
    }
});

export const fetchStories = createAsyncThunk('stories/fetchStories', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/stories/');
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
});

export const createStory = createAsyncThunk('stories/createStory', async (newStory, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        const { title, image } = newStory;

        formData.append('title', title);
        formData.append('image', image, image.name);

        const response = await api.post('/api/stories/', formData);
        return response.data;
    } catch (err) {
        console.error('Caught error:', err);

        if (err.response) {
            console.error('Error response data:', err.response.data);
            return rejectWithValue(err.response.data);
        } else {
            return rejectWithValue('An unexpected error occurred');
        }
    }
});


const storySlice = createSlice({
    name: 'stories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStories.fulfilled, (state, action) => {
                state.stories = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchStories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createStory.fulfilled, (state, action) => {
                state.stories.push(action.payload)
                state.status = 'succeeded';
            })
            .addCase(createStory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload ? action.payload : action.error.message;
            })
            .addCase(fetchSingleStories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSingleStories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stories.push(action.payload);
            })
            .addCase(fetchSingleStories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;

            });
    },
})

export default storySlice.reducer;