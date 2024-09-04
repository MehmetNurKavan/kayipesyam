import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChat, fetchMessages, sendMessage } from './MessagingAPI';

interface Message {
    sender: string;
    text: string;
    timestamp: string;
}

interface MessagingState {
    chatId: string | null;
    messages: Message[];
    isLoading: boolean;
}

const initialState: MessagingState = {
    chatId: null,
    messages: [],
    isLoading: false,
};

export const initializeChat = createAsyncThunk(
    'messaging/initializeChat',
    async ({ user1Email, user2Email }: { user1Email: string; user2Email: string }) => {
        const chatId = await fetchChat(user1Email, user2Email);
        console.log("Fetched chat ID:", chatId);
        return chatId;
    }
);

export const loadMessages = createAsyncThunk(
    'messaging/loadMessages',
    async (chatId: string) => {
        return await fetchMessages(chatId);
    }
);

export const postMessage = createAsyncThunk(
    'messaging/postMessage',
    async ({ chatId, message }: { chatId: string; message: Message }) => {
        await sendMessage(chatId, message);
        return message;
    }
);

const messagingSlice = createSlice({
    name: 'messaging',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initializeChat.fulfilled, (state, action) => {
                console.log("initializeChat fulfilled with chatId:", action.payload);
                state.chatId = action.payload;
            })
            .addCase(loadMessages.pending, (state) => {
                console.log("Loading messages...");
                state.isLoading = true;
            })
            .addCase(loadMessages.fulfilled, (state, action) => {
                console.log("Messages loaded successfully:", action.payload);
                state.isLoading = false;
                state.messages = action.payload;
            })
            .addCase(postMessage.fulfilled, (state, action) => {
                console.log("Message posted successfully:", action.payload);
                state.messages.push(action.payload);
                state.isLoading = false;
            });
    },
});

export default messagingSlice.reducer;
/*
Mesajlaşma durumunu yönetir. Mesajları yüklemek, göndermek, eşyaları teslim edilmiş olarak işaretlemek ve sohbeti sonlandırmak için async thunk'lar içerir.
initializeChat: Kullanıcılar arasında bir sohbet başlatır.
loadMessages: Sohbete ait mesajları getirir.
postMessage: Mesaj gönderir.
markItemAsDelivered: Eşyayı teslim edilmiş olarak işaretler.
endChat: Sohbeti sonlandırır.
*/