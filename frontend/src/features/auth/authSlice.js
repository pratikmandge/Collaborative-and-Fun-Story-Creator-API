import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

const initialState = {
    id: null,
    user: null,
    status: 'idle',
    error: null,
};


export const login = createAsyncThunk('auth/login', async (credential, { rejectWithValue }) => {
    try {
        const response = await api.post('/login/', credential);
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const register = createAsyncThunk('auth/register', async (credantial, { rejectWithValue }) => {
    try {
        const response = await api.post('/register/', credantial);
        return response.data
    } catch {
        return rejectWithValue(error.response.data)
    }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/current-user/');
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.id = null
            state.user = null
            state.status = 'logged out'
            api.post('/register/');
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.id = action.payload.id;
            state.user = action.payload.username;
            state.status = 'succeeded'
        })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.user = action.payload.username;
                state.status = 'user registered'
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'registration failed'
                state.error = action.payload.message
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.user = action.payload.username;
                state.status = 'authenticated'
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = 'unauthenticated'
                state.error = action.payload.message
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;