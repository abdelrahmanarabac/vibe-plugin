/**
 * Result<T, E> - Rust-inspired error handling pattern
 * 
 * Replaces throwing errors with explicit success/failure handling.
 * Forces consumers to handle both paths, preventing silent failures.
 * 
 * @example
 * ```typescript
 * const result = await someOperation();
 * if (result.isOk()) {
 *   console.log(result.value);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */

export type Result<T, E = Error> = Ok<T> | Err<E>;

export class Ok<T> {
    readonly ok = true as const;
    readonly err = false as const;
    readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    isOk(): this is Ok<T> {
        return true;
    }

    isErr(): this is never {
        return false;
    }

    /**
     * Maps the success value to a new value
     */
    map<U>(fn: (value: T) => U): Result<U, never> {
        return new Ok(fn(this.value));
    }

    /**
     * Returns the value or throws if Err (use sparingly)
     */
    unwrap(): T {
        return this.value;
    }

    /**
     * Returns the value or a default
     */
    unwrapOr(_defaultValue: T): T {
        return this.value;
    }
}

export class Err<E> {
    readonly ok = false as const;
    readonly err = true as const;
    readonly error: E;

    constructor(error: E) {
        this.error = error;
    }

    isOk(): this is never {
        return false;
    }

    isErr(): this is Err<E> {
        return true;
    }

    map<U>(_fn: (value: never) => U): Result<U, E> {
        return this as unknown as Err<E>;
    }

    unwrap(): never {
        throw this.error;
    }

    unwrapOr<T>(defaultValue: T): T {
        return defaultValue;
    }
}

/**
 * Creates a successful Result
 */
export function ok<T>(value: T): Ok<T> {
    return new Ok(value);
}

/**
 * Creates an error Result
 */
export function err<E>(error: E): Err<E> {
    return new Err(error);
}
