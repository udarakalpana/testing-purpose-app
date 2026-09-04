const TOKEN_KEY = 'rlda.token';
const USER_KEY = 'rlda.user';

export type UserRole = 'admin' | 'user';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

/**
 * The Redux store is the source of truth for the session. These helpers mirror
 * it into localStorage so a refresh or a new tab does not sign the user out.
 */
export function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);

    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function storeSession(token: string, user: AuthUser): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // A browser with storage disabled still works, just not across reloads.
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}
