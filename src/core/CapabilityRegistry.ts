import type { ICapability } from './interfaces/ICapability';

export class CapabilityRegistry {
    private capabilities: Map<string, ICapability> = new Map();
    private commandMap: Map<string, string> = new Map(); // CommandID -> CapabilityID

    /**
     * Registers a new capability in the system
     */
    register(capability: ICapability): void {
        if (this.capabilities.has(capability.id)) {
            console.warn(`[Vibe] Capability ${capability.id} already registered. Overwriting.`);
        }

        this.capabilities.set(capability.id, capability);
        this.commandMap.set(capability.commandId, capability.id);
    }

    /**
     * Retrieves a capability by its Command ID (e.g., 'SCAN_SELECTION')
     */
    getByCommand(commandId: string): ICapability | undefined {
        const capId = this.commandMap.get(commandId);
        if (!capId) return undefined;
        return this.capabilities.get(capId);
    }

    /**
     * Retrieves a capability by its unique ID
     */
    get(id: string): ICapability | undefined {
        return this.capabilities.get(id);
    }

    /**
     * List all registered capabilities
     */
    list(): ICapability[] {
        return Array.from(this.capabilities.values());
    }
}
