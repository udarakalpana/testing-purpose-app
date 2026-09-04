import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import type { ApiFailure, FieldErrors } from '../../lib/apiError';
import { toApiFailure } from '../../lib/apiError';
import type { AuthUser } from '../../lib/storage';
import { clearStoredSession, readStoredToken, readStoredUser, storeSession } from '../../lib/storage';

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'failed';
  message: string | null;
  fieldErrors: FieldErrors | null;
};

const initialState: AuthState = {
  token: readStoredToken(),
  user: readStoredUser(),
  status: 'idle',
  message: null,
  fieldErrors: null,
};

export const signIn = createAsyncThunk<
  { token: string; user: AuthUser },
  { email: string; password: string },
  { rejectValue: ApiFailure }
>('auth/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/api/login', credentials);

    storeSession(data.token, data.user);

    return data;
  } catch (error) {
    return rejectWithValue(toApiFailure(error));
  }
});

/**
 * Revoking the token server-side is best effort: the local session is cleared
 * either way so a failed request cannot strand the user in a signed-in state.
 */
export const signOut = createAsyncThunk('auth/signOut', async () => {
  try {
    await api.post('/api/logout');
  } finally {
    clearStoredSession();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired(state) {
      clearStoredSession();

      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.message = 'Your session has expired. Please sign in again.';
      state.fieldErrors = null;
    },
    errorsCleared(state) {
      state.message = null;
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.message = null;
        state.fieldErrors = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.message = null;
        state.fieldErrors = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload?.message ?? 'Something went wrong. Please try again.';
        state.fieldErrors = action.payload?.fieldErrors ?? null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
        state.message = null;
        state.fieldErrors = null;
      })
      .addCase(signOut.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
        state.message = null;
        state.fieldErrors = null;
      });
  },
});

export const { sessionExpired, errorsCleared } = authSlice.actions;

export default authSlice.reducer;
