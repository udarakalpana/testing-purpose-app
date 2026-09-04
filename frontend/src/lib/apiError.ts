import { AxiosError } from 'axios';

export type FieldErrors = Record<string, string[]>;

export type ApiFailure = {
  message: string;
  fieldErrors: FieldErrors | null;
};

type LaravelErrorBody = {
  message?: string;
  errors?: FieldErrors;
};

/**
 * Turn an Axios rejection into something a form can render.
 *
 * Laravel answers 422 with per-field errors, and 401/403/429 with a message
 * only, so the two are kept separate rather than flattened together.
 */
export function toApiFailure(error: unknown): ApiFailure {
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
