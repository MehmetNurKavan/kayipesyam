import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { addRequestItem } from "./RequestAPI";

export interface RequestItems {
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
    comment: string;
    itemId: string;
}

export interface RequestFormState {
    status: "idle" | "loading" | "failed";
}

const initialState: RequestFormState = {
    status: "idle",
};

export const submitRequest = createAsyncThunk(
    "requestForm/submitRequest",
    async (formData: any, { rejectWithValue }) => {
        try {
            await addRequestItem(formData);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const requestFormSlice = createSlice({
    name: "requestForm",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitRequest.pending, (state) => {
                state.status = "loading";
            })
            .addCase(submitRequest.fulfilled, (state) => {
                state.status = "idle";
            })
            .addCase(submitRequest.rejected, (state) => {
                state.status = "failed";
            })
    },
});

export const selectRequestFormStatus = (state: RootState) => state.requestForm.status;

export default requestFormSlice.reducer;
