/**
 * Standard Application Errors for Vibe Plugin
 * Enables precise error handling and user feedback.
 */

export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class AIModelError extends AppError {
    constructor(message: string = 'AI Model Service is currently unavailable.') {
        super(message);
    }
}

export class AIModelOverloadedError extends AIModelError {
    constructor(retryAfterMs?: number) {
        super(`AI Model is overloaded. Please try again ${retryAfterMs ? `in ${retryAfterMs / 1000}s` : 'later'}.`);
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network connection failed.') {
        super(message);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message);
    }
}

export class ConfigurationError extends AppError {
    constructor(message: string) {
        super(message);
    }
}
