import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import contributionReducer from '../features/contributions/contributionSlice';
import storyReducer from '../features/stories/storySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contributions: contributionReducer,
        stories: storyReducer,
    },
});

export default store;
