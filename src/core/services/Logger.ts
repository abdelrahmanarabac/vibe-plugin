/**
 * 📝 Logger Service
 * 
 * Centralized logging abstraction for the Vibe Plugin.
 * Replaces raw console.log/warn/error with structured, filterable logs.
 * 
 * Features:
 * - Log Levels: debug, info, warn, error, silent
 * - Context Namespacing: e.g. 'controller:message', 'sync:drift'
 * - Production Safe: Can be silenced completely
 * - Structured Data: Accepts objects for rich context
 * 
 * Usage:
 * ```ts
 * import { logger } from '@/core/services/Logger';
 * 
 * logger.info('controller', 'Message received', { type: msg.type });
 * logger.error('sync', 'Sync failed', { error });
 * ```
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

interface LoggerConfig {
    level: LogLevel;
    enableTimestamp: boolean;
    enableContext: boolean;
}

class LoggerService {
    private config: LoggerConfig = {
        level: 'info',
        enableTimestamp: true,
        enableContext: true
    };

    private readonly levels: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        silent: 999
    };

    /**
     * Set the minimum log level
     * Logs below this level will be suppressed
     */
    setLevel(level: LogLevel): void {
        this.config.level = level;
    }

    /**
     * Configure logger behavior
     */
    configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Debug level logging (most verbose)
     * Use for detailed debugging information
     */
    debug(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('debug', context, message, data);
    }

    /**
     * Info level logging
     * Use for general informational messages
     */
    info(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('info', context, message, data);
    }

    /**
     * Warning level logging
     * Use for potentially problematic situations
     */
    warn(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('warn', context, message, data);
    }

    /**
     * Error level logging
     * Use for error conditions
     */
    error(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('error', context, message, data);
    }

    /**
     * Internal log method
     */
    private log(
        level: LogLevel,
        context: string,
        message: string,
        data?: Record<string, unknown>
    ): void {
        // Check if this log level should be displayed
        if (this.levels[level] < this.levels[this.config.level]) {
            return;
        }

        // Build log prefix
        const parts: string[] = [];

        if (this.config.enableTimestamp) {
            parts.push(this.getTimestamp());
        }

        if (this.config.enableContext) {
            parts.push(`[${context}]`);
        }

        const prefix = parts.join(' ');
        const fullMessage = `${prefix} ${message}`;

        // Output to appropriate console method
        switch (level) {
            case 'debug':
            case 'info':
                if (data) {
                    console.log(fullMessage, data);
                } else {
                    console.log(fullMessage);
                }
                break;
            case 'warn':
                if (data) {
                    console.warn(fullMessage, data);
                } else {
                    console.warn(fullMessage);
                }
                break;
            case 'error':
                if (data) {
                    console.error(fullMessage, data);
                } else {
                    console.error(fullMessage);
                }
                break;
        }
    }

    /**
     * Get formatted timestamp
     */
    private getTimestamp(): string {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }

    /**
     * Clear console (use sparingly)
     */
    clear(): void {
        console.clear();
    }
}

// Export singleton instance
export const logger = new LoggerService();

// Export for production builds
if (typeof window !== 'undefined') {
    // Make logger available on window for debugging in production
    (window as typeof window & { __vibeLogger?: LoggerService }).__vibeLogger = logger;
}
