/**
 * Result Pattern for strict error handling without try-catch spam.
 * @template T Success payload
 * @template E Error payload (defaults to string)
 */
export type Result<T, E = string> =
    | { success: true; value: T }
    | { success: false; error: E };

export const Result = {
    ok: <T>(value: T): Result<T> => ({ success: true, value }),
    fail: <E, T = never>(error: E): Result<T, E> => ({ success: false, error } as Result<T, E>),

    /**
     * Safely executes a promise and returns a Result.
     */
    fromPromise: async <T>(promise: Promise<T>): Promise<Result<T, string>> => {
        try {
            const data = await promise;
            return Result.ok(data);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return Result.fail(message || 'Unknown error');
        }
    }
};
