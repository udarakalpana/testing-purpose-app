import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../../lib/axios';
import type { AuthUser } from '../../lib/storage';
import { clearStoredSession, readStoredToken, readStoredUser, storeSession } from '../../lib/storage';

export type FieldErrors = Record<string, string[]>;

type SignInFailure = {
  message: string;
  fieldErrors: FieldErrors | null;
};

type LaravelErrorBody = {
  message?: string;
  errors?: FieldErrors;
};

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

/**
 * Turn an Axios rejection into something the sign-in form can render.
 *
 * The API answers 422 for both a malformed email and a wrong password, and 429
 * once the login throttle trips, so the message and the per-field errors are
 * kept separate.
 */
function toSignInFailure(error: unknown): SignInFailure {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return {
        message: 'Could not reach the server. Check your connection and try again.',
        fieldErrors: null,
      };
    }

    const body = error.response.data as LaravelErrorBody;

    return {
      message: body.message ?? 'Something went wrong. Please try again.',
      fieldErrors: body.errors ?? null,
    };
  }

  return { message: 'Something went wrong. Please try again.', fieldErrors: null };
}

export const signIn = createAsyncThunk<
  { token: string; user: AuthUser },
  { email: string; password: string },
  { rejectValue: SignInFailure }
>('auth/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post<{ token: string; user: AuthUser }>('/api/login', credentials);

    storeSession(data.token, data.user);

    return data;
  } catch (error) {
    return rejectWithValue(toSignInFailure(error));
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
