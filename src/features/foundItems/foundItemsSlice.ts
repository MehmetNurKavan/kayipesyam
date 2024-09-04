import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FoundItem {
    id?: string; // Firebase tarafından otomatik oluşturulan ID
    productId?: string; // Kullanıcı tarafından isteğe bağlı girilen ID
    name: string;
    surname: string;
    phone: string;
    foundLocation: string;
    currentLocation: string;
    photoUrl: string;
    barcodePhotoUrl?: string;
    postedBy: string;
    itemType: string;
    isDelivered?: boolean;
    date: string;
    city: string;
    district: string;
}

interface FoundItemsState {
    items: FoundItem[];
}

const initialState: FoundItemsState = {
    items: [],
};

const foundItemsSlice = createSlice({
    name: 'foundItems',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<FoundItem[]>) {
            state.items = action.payload;
        },

        addItem(state, action: PayloadAction<FoundItem>) {
            state.items.push(action.payload);
        },
        removeItem(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
    },
});

export const { setItems, addItem, removeItem } = foundItemsSlice.actions;
export default foundItemsSlice.reducer;
