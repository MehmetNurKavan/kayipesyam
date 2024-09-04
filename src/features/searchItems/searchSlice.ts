import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchItemsFromFirebase } from "./SearchAPI";

// Asenkron veri çekme işlemi
export const fetchItems = createAsyncThunk(
    "search/fetchItems",
    async (filters: any) => {
        const response = await fetchItemsFromFirebase(filters);
        return response;
    }
);

// State'in tipi
interface ItemType {
    id: string;
    itemType: string;
    photoUrl: string;
    date: string;
    city: string;
    district: string;
}

interface SearchState {
    items: ItemType[];
    totalItems: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// initialState tanımı
const initialState: SearchState = {
    items: [],
    totalItems: 0,
    status: "idle",
    error: null as string | null, // Hata durumunu null olarak başlat,
};

// Redux slice'ı oluşturulması
const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.error = null; // Başarı durumunda hatayı sıfırla
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? "Bir hata oluştu"; // `undefined` durumunu kontrol et
            });
    },
});

export default searchSlice.reducer;
