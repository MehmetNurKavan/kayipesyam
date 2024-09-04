import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { fetchMatches } from './MatchingAPI';
import { type LostItem } from '../lostItems/lostItemsSlice';
import type { FoundItem } from '../foundItems/foundItemsSlice';

export interface Match {
    lostItemId: string;
    foundItemId: string;
    lostItem: LostItem;
    foundItem: FoundItem;
    chatEnded: boolean;
}

interface MatchingState {
    matches: Match[];
    loading: boolean;
    error: string | null;
}

const initialState: MatchingState = {
    matches: [],
    loading: false,
    error: null,
};

export const fetchMatchesAsync = createAsyncThunk(
    'matching/fetchMatches',
    async () => {
        const matches = await fetchMatches();
        return matches;
    }
);

export const markItemAsDeliveredAsync = createAsyncThunk(
    'matching/markItemAsDelivered',
    async ({ lostItemId, foundItemId }: { lostItemId: string, foundItemId: string }) => {
        const db = getFirestore();
        const docRef = doc(db, 'matches', `${lostItemId}-${foundItemId}`);
        await updateDoc(docRef, {
            'lostItem.isDelivered': true,
            'foundItem.isDelivered': true,
        });
        return { lostItemId, foundItemId };
    }
);

export const endChatAsync = createAsyncThunk(
    'matching/endChat',
    async ({ chatId }: { chatId: string }) => {
        const db = getFirestore();
        const docRef = doc(db, 'chats', chatId);
        await updateDoc(docRef, {
            chatEnded: true,
        });
        return chatId;
    }
);

const matchingSlice = createSlice({
    name: 'matching',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMatchesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMatchesAsync.fulfilled, (state, action: PayloadAction<Match[]>) => {
                state.loading = false;
                state.matches = action.payload;
            })
            .addCase(fetchMatchesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch matches';
            })
            .addCase(markItemAsDeliveredAsync.fulfilled, (state, action: PayloadAction<{ lostItemId: string; foundItemId: string }>) => {
                const { lostItemId, foundItemId } = action.payload;
                const match = state.matches.find(m => m.lostItemId === lostItemId && m.foundItemId === foundItemId);
                if (match) {
                    match.lostItem.isDelivered = true;
                    match.foundItem.isDelivered = true;
                }
            })
            .addCase(endChatAsync.fulfilled, (state, action: PayloadAction<string>) => {
                const chatId = action.payload;
                const match = state.matches.find(m => `${m.lostItemId}-${m.foundItemId}` === chatId);
                if (match) {
                    match.chatEnded = true;
                }
            });
    },
});

export default matchingSlice.reducer;


/*
Redux Toolkit kullanarak eşleşme durumu için slice tanımlar. Eşleşmeleri almak, teslim etme ve sohbet sonlandırma işlemleri için async thunk'lar içerir.
fetchMatchesAsync: Eşleşmeleri asenkron olarak getirir.
markItemAsDeliveredAsync: Eşyayı teslim edilmiş olarak işaretler.
endChatAsync: Sohbeti sonlandırır. */