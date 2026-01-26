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
    fail: <E>(error: E): Result<any, E> => ({ success: false, error }),

    /**
     * Safely executes a promise and returns a Result.
     */
    fromPromise: async <T>(promise: Promise<T>): Promise<Result<T, string>> => {
        try {
            const data = await promise;
            return Result.ok(data);
        } catch (e: any) {
            return Result.fail(e.message || 'Unknown error');
        }
    }
};
