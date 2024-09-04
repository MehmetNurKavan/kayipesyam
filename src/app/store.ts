import { configureStore } from '@reduxjs/toolkit';
import lostItemsReducer from '../features/lostItems/lostItemsSlice';
import foundItemsReducer from '../features/foundItems/foundItemsSlice';
import profileReducer from '../features/profile/profileSlice';
import matchingReducer from '../features/matching/matchingSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import messagingReducer from '../features/messaging/messagingSlice';
import authReducer from '../features/auth/authSlice';
import searchReducer from '../features/searchItems/searchSlice';
import requestFormReducer from '../features/request/requestSlice';


const store = configureStore({
  reducer: {
    lostItems: lostItemsReducer,
    foundItems: foundItemsReducer,
    profile: profileReducer,
    matching: matchingReducer,
    notifications: notificationsReducer,
    messaging: messagingReducer,
    auth: authReducer,
    search: searchReducer,
    requestForm: requestFormReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
