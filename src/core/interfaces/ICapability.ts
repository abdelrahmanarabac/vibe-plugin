import type { AgentContext } from '../AgentContext';
import type { Result } from '../../shared/lib/result';

/**
 * Standard Interface for ALL Plugin Features (Capabilities).
 * Replaces the monolithic controller switch statement.
 */
export interface ICapability<TPayload = unknown, TResult = unknown> {
    /**
     * Unique Identifier (e.g., 'scan-selection-v1')
     */
    readonly id: string;

    /**
     * The Command ID this capability responds to (e.g., 'SCAN_SELECTION')
     */
    readonly commandId: string;

    /**
     * Description for the Help/Docs system
     */
    readonly description?: string;

    /**
     * Guard Clause: Can this capability run right now?
     * @param context Current agent context
     */
    canExecute(context: AgentContext): boolean;

    /**
     * Core Logic execution.
     * @param payload Data from the UI or System
     * @param context Current agent context
     */
    execute(payload: TPayload, context: AgentContext): Promise<Result<TResult>>;
}
