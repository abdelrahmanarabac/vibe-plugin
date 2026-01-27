import { TokenRepository } from './TokenRepository';
import { CapabilityRegistry } from './CapabilityRegistry';
import { EventLoop } from './EventLoop';
import { SyncService } from './services/SyncService';

// Core Modules
import { VariableManager } from '../modules/governance/VariableManager';
import { DocsRenderer } from '../modules/documentation/DocsRenderer';
import { CollectionRenamer } from '../modules/collections/adapters/CollectionRenamer';

// Infrastructure
import { FigmaVariableRepository } from '../infrastructure/repositories/FigmaVariableRepository';

// Capabilities
import { ScanSelectionCapability } from '../modules/perception/capabilities/scanning/ScanSelectionCapability';
import { SyncTokensCapability } from '../modules/tokens/capabilities/sync/SyncTokensCapability';
import { CreateVariableCapability } from '../modules/tokens/capabilities/management/CreateVariableCapability';
import { UpdateVariableCapability } from '../modules/tokens/capabilities/management/UpdateVariableCapability';
import { RenameVariableCapability } from '../modules/tokens/capabilities/management/RenameVariableCapability';
import { GenerateDocsCapability } from '../modules/documentation/capabilities/GenerateDocsCapability';
import { GetAnatomyCapability } from '../modules/perception/capabilities/scanning/GetAnatomyCapability';
import { RenameCollectionsCapability } from '../modules/collections/capabilities/RenameCollectionsCapability';
import { CreateCollectionCapability } from '../modules/collections/capabilities/CreateCollectionCapability';
import { TraceLineageCapability } from '../modules/intelligence/capabilities/TraceLineageCapability';
import { CreateStyleCapability } from '../modules/styles/capabilities/CreateStyleCapability';

export class CompositionRoot {
    // Public Services
    public readonly registry: CapabilityRegistry;
    public readonly eventLoop: EventLoop;
    public readonly repository: TokenRepository;
    public readonly syncService: SyncService;

    constructor() {
        console.log('[CompositionRoot] Wiring dependencies...');

        // 1. Core State
        this.repository = new TokenRepository();
        const variableRepo = new FigmaVariableRepository();

        // 2. Domain Services
        const variableManager = new VariableManager(this.repository, variableRepo);
        const docsRenderer = new DocsRenderer(this.repository);
        const collectionRenamer = new CollectionRenamer();

        this.syncService = new SyncService(variableManager, this.repository);

        // 3. Capabilities
        this.registry = new CapabilityRegistry();
        this.registerCapabilities(variableManager, docsRenderer, collectionRenamer);

        // 4. Background Services (EventLoop)
        // We inject a placeholder callback, the Controller will bind the actual UI-messaging logic
        // or we can pass the logic here if we invert control properly.
        // For now, we expose the EventLoop and let the Controller bind the callback.
        this.eventLoop = new EventLoop(async () => {
            // Default no-op, Controller will override or we pass it in 'start'
        });
    }

    private registerCapabilities(
        variableManager: VariableManager,
        docsRenderer: DocsRenderer,
        collectionRenamer: CollectionRenamer
    ) {
        const capabilities = [
            new ScanSelectionCapability(),
            new SyncTokensCapability(variableManager),
            new CreateVariableCapability(variableManager),
            new UpdateVariableCapability(variableManager),
            new RenameVariableCapability(variableManager),
            new GenerateDocsCapability(docsRenderer, variableManager),
            new RenameCollectionsCapability(collectionRenamer),
            new CreateCollectionCapability(),
            new GetAnatomyCapability(),
            new TraceLineageCapability(),
            new CreateStyleCapability()
        ];

        capabilities.forEach(cap => this.registry.register(cap));
    }
}
