import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  theme: 'light' | 'dark';
  globalMessage: string | null;
}

const initialState: AppState = {
  theme: 'light',
  globalMessage: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setGlobalMessage(state, action: PayloadAction<string | null>) {
      state.globalMessage = action.payload;
    },
  },
});

export const { setTheme, setGlobalMessage } = appSlice.actions;
export default appSlice.reducer;
