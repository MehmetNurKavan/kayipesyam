import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
    email: string | null;
}

const initialState: ProfileState = {
    email: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setEmail(state, action: PayloadAction<string | null>) {
            state.email = action.payload;
        },
        clearProfile(state) {
            state.email = null;
        },
    },
});

export const { setEmail, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
