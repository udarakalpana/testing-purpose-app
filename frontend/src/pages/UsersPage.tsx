import { useState } from 'react';
import type { FormEvent } from 'react';
import type { FieldErrors } from '../lib/apiError';
import type { UserRole } from '../lib/storage';
import { registerUser } from '../features/users/registerUser';

type FormState = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user',
};

const fieldClasses =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 aria-invalid:border-red-400 aria-invalid:focus:ring-red-500/20';

export default function UsersPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setFieldErrors(null);
    setMessage(null);
    setCreated(null);

    const result = await registerUser(form);

    setIsSubmitting(false);

    if (result.ok) {
      setCreated(`${result.user.name} (${result.user.email}) was registered as ${result.user.role}.`);
      setForm(emptyForm);

      return;
    }

    setFieldErrors(result.failure.fieldErrors);

    if (!result.failure.fieldErrors) {
      setMessage(result.failure.message);
    }
  }

  function errorFor(field: keyof FormState): string | undefined {
    return fieldErrors?.[field]?.[0];
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Register an account for someone else. Only administrators can do this.
        </p>
      </div>

      {created && (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {created}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {message && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={Boolean(errorFor('name'))}
            aria-describedby={errorFor('name') ? 'name-error' : undefined}
            className={fieldClasses}
            placeholder="Ada Lovelace"
          />
          {errorFor('name') && (
            <p id="name-error" className="text-sm text-red-600">
              {errorFor('name')}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            required
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={Boolean(errorFor('email'))}
            aria-describedby={errorFor('email') ? 'email-error' : undefined}
            className={fieldClasses}
            placeholder="ada@example.com"
          />
          {errorFor('email') && (
            <p id="email-error" className="text-sm text-red-600">
              {errorFor('email')}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              aria-invalid={Boolean(errorFor('password'))}
              aria-describedby={errorFor('password') ? 'password-error' : 'password-hint'}
              className={fieldClasses}
              placeholder="••••••••"
            />
            {errorFor('password') ? (
              <p id="password-error" className="text-sm text-red-600">
                {errorFor('password')}
              </p>
            ) : (
              <p id="password-hint" className="text-xs text-slate-400">
                At least 8 characters.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              value={form.password_confirmation}
              onChange={(event) => update('password_confirmation', event.target.value)}
              className={fieldClasses}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="role" className="text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={(event) => update('role', event.target.value as UserRole)}
            aria-invalid={Boolean(errorFor('role'))}
            aria-describedby={errorFor('role') ? 'role-error' : undefined}
            className={fieldClasses}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errorFor('role') && (
            <p id="role-error" className="text-sm text-red-600">
              {errorFor('role')}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {isSubmitting ? 'Registering…' : 'Register user'}
        </button>
      </form>

      <p className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
        Existing accounts are not listed here yet — the API has no endpoint for reading users.
      </p>
    </div>
  );
}
