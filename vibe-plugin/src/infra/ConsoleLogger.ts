import type { ILogger } from '../core/interfaces/ICapability';

/**
 * ConsoleLogger - Simple logger implementation for development
 * 
 * In production, this could be replaced with a remote logging service.
 */
export class ConsoleLogger implements ILogger {
    private readonly prefix = '[Vibe]';

    info(message: string, meta?: Record<string, any>): void {
        console.log(`${this.prefix} ℹ️ ${message}`, meta || '');
    }

    warn(message: string, meta?: Record<string, any>): void {
        console.warn(`${this.prefix} ⚠️ ${message}`, meta || '');
    }

    error(message: string, error?: Error, meta?: Record<string, any>): void {
        console.error(`${this.prefix} ❌ ${message}`, error, meta || '');
    }

    debug(message: string, meta?: Record<string, any>): void {
        // Always log debug in this dev phase
        console.debug(`${this.prefix} 🐛 ${message}`, meta || '');
    }
}
