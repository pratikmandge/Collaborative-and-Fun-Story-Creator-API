import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

const initialState = {
    stories: [],
    status: 'idle',
    error: null,
};

export const fetchSingleStories = createAsyncThunk('stories/fetchSingleStories', async (storyId) => {
    const response = await api.get(`/api/stories/${storyId}`);
    return response.data;
});

export const fetchStories = createAsyncThunk('stories/fetchStories', async () => {
    const response = await api.get('/api/stories/');
    return response.data;
});

export const createStory = createAsyncThunk('stories/createStory', async (newStory) => {
    const formData = new FormData();
    const { title, image } = newStory;  // Destructure image property

    formData.append('title', title);
    formData.append('image', image, image.name);  // Include filename

    // for (const key in newStory) {
    //     if (newStory.hasOwnProperty(key)) {
    //         formData.append(key, newStory[key]);
    //     }
    // }

    // console.log('Image type:', newStory['image'] instanceof File)
    // console.log('FormData:', [...formData.entries()]);
    // console.log('FormData:', [...formData.entries()]);

    const response = await api.post('/api/stories/', formData);
    return response.data;
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
                state.error = action.error.message;
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