import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, logout } from './authAPI';
import { auth } from '../../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthState {
    user: any;
    status: 'idle' | 'loading' | 'failed';
    error?: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }) => {
        try {
            const response = await login(email, password);
            return response;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Bir hata oluştu.');
            }
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ email, password }: { email: string; password: string }) => {
        try {
            const response = await register(email, password);
            return response;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Bir hata oluştu.');
            }
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        try {
            await logout();
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Bir hata oluştu.');
            }
        }
    }
);

// Thunk to check auth state on page load
export const checkAuthState = createAsyncThunk(
    'auth/checkAuthState',
    async (_, { rejectWithValue }) => {
        return new Promise<any>((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth,
                (user) => {
                    unsubscribe(); // Clean up the subscription
                    resolve(user ? user : null);
                },
                (error) => {
                    unsubscribe(); // Clean up the subscription
                    reject(rejectWithValue ? rejectWithValue(error) : error);
                }
            );
        });
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthState.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkAuthState.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(checkAuthState.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Bir hata oluştu';
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Bir hata oluştu';
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'idle';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Bir hata oluştu';
            })
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = 'idle';
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Bir hata oluştu';
            });
    },
});

export default authSlice.reducer;
