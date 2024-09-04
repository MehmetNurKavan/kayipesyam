// lostItemsSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LostItem {
    id?: string; // Firebase tarafından otomatik oluşturulan ID
    productId?: string; // Kullanıcı tarafından isteğe bağlı girilen ID
    name: string;
    surname: string;
    phone: string;
    lostLocation: string;
    personalLocation: string;
    itemType: string;
    photoUrl: string;
    barcodePhotoUrl?: string;
    postedBy: string;
    isDelivered?: boolean;
    date: string;
    city: string;
    district: string;
}

interface LostItemsState {
    items: LostItem[];
}

const initialState: LostItemsState = {
    items: [],
};

const lostItemsSlice = createSlice({
    name: 'lostItems',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<LostItem[]>) {
            state.items = action.payload;
        },
        addItem(state, action: PayloadAction<LostItem>) {
            state.items.push(action.payload);
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
    },
});

export const { setItems, addItem, removeItem } = lostItemsSlice.actions;
export default lostItemsSlice.reducer;
