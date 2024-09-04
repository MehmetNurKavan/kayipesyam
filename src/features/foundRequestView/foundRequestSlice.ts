import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getRequestItem } from './foundRequestAPI';

interface RequestViewState {
    item: any; // Define a proper type if possible
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RequestViewState = {
    item: null,
    status: 'idle',
    error: null,
};

// Async thunk to fetch the request item by ID
export const fetchRequestItem = createAsyncThunk(
    'requestView/fetchRequestItem',
    async (id: string) => {
        const response = await getRequestItem(id);
        return response;
    }
);

const requestViewSlice = createSlice({
    name: 'requestView',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRequestItem.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchRequestItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.item = action.payload;
            })
            .addCase(fetchRequestItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export default requestViewSlice.reducer;
