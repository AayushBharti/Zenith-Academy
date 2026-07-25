/** Discriminated union for fallible operations. Callers pattern-match on `ok`. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/** Wrap a success value in a Result. */
export const ok = <T>(data: T): Result<T> => ({ ok: true, data });

/** Wrap an error message in a Result. */
export const err = <T>(error: string): Result<T> => ({ ok: false, error });
