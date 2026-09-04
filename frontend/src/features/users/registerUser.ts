import api from '../../lib/axios';
import type { ApiFailure } from '../../lib/apiError';
import { toApiFailure } from '../../lib/apiError';
import type { AuthUser, UserRole } from '../../lib/storage';

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
};

export type RegisterUserResult =
  | { ok: true; user: AuthUser }
  | { ok: false; failure: ApiFailure };

/**
 * Create an account on behalf of an administrator.
 *
 * The result is returned rather than thrown so the form can render a failure
 * without a try/catch at the call site. This deliberately does not live in a
 * Redux slice: nothing outside the form needs the outcome.
 */
export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
  try {
    const { data } = await api.post<{ user: AuthUser }>('/api/users', input);

    return { ok: true, user: data.user };
  } catch (error) {
    return { ok: false, failure: toApiFailure(error) };
  }
}
