# Vibe Tokens Plugin - Technical Documentation

## High-Level Overview

**Vibe Tokens** is a professional Figma plugin designed to manage design tokens with a focus on "semantic intelligence" and "vibe" (aesthetic alignment). It is built using **React** (UI), **TypeScript**, and adheres to a strict **Clean Architecture (v2.2)**.

The plugin bridges the gap between Figma's native variables and a structured, code-ready token graph. It features:
- **Bi-directional Sync**: Syncs tokens between Figma Variables and an internal Graph Repository.
- **Semantic Intelligence**: Suggests names, generates descriptions, and validates accessibility using AI/Algorithms.
- **Visual Graph**: View lineage and dependencies of tokens.
- **Health Checks**: Validates tokens against quality standards (e.g., WCAG contrast).

## Folder Structure

The project follows a Domain-Driven Design (DDD) inspired structure:

```
src/
├── core/               # Domain Core (Architecture, Interfaces, Base Classes)
├── infrastructure/     # Adapters (Figma API, Cloud Storage)
├── modules/            # Business Logic grouped by Domain (Tokens, Intelligence, etc.)
├── ui/                 # React Presentation Layer
├── shared/             # Utilities and Shared Types
├── context/            # React Contexts
└── workers/            # Web Workers for heavy computations
```

## Detailed File & Function Explanation

### 1. Core (`src/core`)

*   **`CompositionRoot.ts`**:
    *   **Purpose**: The Dependency Injection (DI) container.
    *   **Functionality**: Instantiates all services, repositories, and registers capabilities.
    *   **Key Method**: `constructor()` wires everything together; `registerCapabilities()` registers all available actions.
*   **`AgentContext.ts`**:
    *   **Purpose**: Defines the context passed to every Capability execution.
    *   **Content**: `repository`, `selection`, `page`, `session`.
*   **`CapabilityRegistry.ts`**:
    *   **Purpose**: Manages the list of available commands.
    *   **Functionality**: Maps command strings (e.g., `'REQUEST_GRAPH'`) to `ICapability` instances.
*   **`TokenRepository.ts`**:
    *   **Purpose**: In-memory graph database for tokens.
    *   **Functionality**: Stores `TokenEntity` objects, manages adjacency lists for dependency tracking (`getAncestry`, `getImpact`).

### 2. Modules (`src/modules`)

#### System (`src/modules/system`)
*   **`capabilities/`**: Contains system-level actions.
    *   **`RequestGraphCapability.ts`**: Triggers a full sync and returns the token graph.
    *   **`RequestStatsCapability.ts`**: Returns usage statistics.
    *   **`ResizeWindowCapability.ts`**: Resizes the plugin window.
    *   **`NotifyCapability.ts`**: Shows Figma notifications.
    *   **`StorageGet/SetCapability.ts`**: Wraps `figma.clientStorage`.
    *   **`SyncVariablesCapability.ts`**: Alias for `REQUEST_GRAPH` to ensure variable sync.

#### Tokens (`src/modules/tokens`)
*   **`domain/services/`**:
    *   **`TokenCompiler.ts`**: Resolves token aliases (e.g., `{color.primary}`) to final values.
    *   **`SemanticMapper.ts`**: Generates semantic tokens from raw primitives.
    *   **`ColorPalette.ts`**: Algorithmic color scale generation (tints/shades).
*   **`capabilities/`**:
    *   **`SyncTokensCapability.ts`**: Syncs Figma variables to the internal repository.

#### Intelligence (`src/modules/intelligence`)
*   **`QualityGate.ts`**:
    *   **Function**: `validate(tokens)`
    *   **Purpose**: Checks tokens for issues like invalid hex codes or low contrast.
*   **`capabilities/CheckHealthCapability.ts`**:
    *   **Purpose**: Exposes `QualityGate` validation as a command `CHECK_HEALTH`.

### 3. Controller (`src/controller.ts`)

*   **Purpose**: The main thread entry point (Backend).
*   **Functionality**:
    1.  Bootstraps `CompositionRoot`.
    2.  Sets up the `EventLoop`.
    3.  Listens to `figma.ui.onmessage`.
    4.  Dispatches messages to the `CapabilityRegistry`.
*   **Refactor Note**: The switch-case fallback has been replaced by explicit System Capabilities.

### 4. UI (`src/ui`)

*   **`App.tsx`**:
    *   **Purpose**: Main React component.
    *   **Functionality**: Handles routing (Tabs) and global state via `useVibeApp`.
*   **`layouts/ActivityLayout.tsx`**:
    *   **Purpose**: Focused layout for full-screen tasks (e.g., Create Token).
*   **`hooks/useTokens.ts`**:
    *   **Purpose**: React hook to manage token state.
    *   **Functionality**: Listens for `GRAPH_UPDATED`, `REQUEST_GRAPH_SUCCESS` events from the controller.

## Data Flow

1.  **Initialization**:
    *   `controller.ts` starts, creates `CompositionRoot`.
    *   `UI` starts, sends `REQUEST_GRAPH`.
2.  **Command Execution**:
    *   UI sends `{ type: 'REQUEST_GRAPH' }`.
    *   `controller.ts` receives message.
    *   Dispatcher finds `RequestGraphCapability`.
    *   Capability calls `SyncService.sync()`.
    *   `SyncService` reads Figma variables, updates `TokenRepository`, returns tokens.
    *   Dispatcher sends `REQUEST_GRAPH_SUCCESS` with tokens.
    *   Controller also calls `broadcastStats()` (via auto-stats logic).
3.  **State Update**:
    *   `useTokens` hook receives message, updates React state.
    *   Components re-render with new data.

## Key Improvements (Refactor)

*   **System Capabilities**: Moved generic logic (`RESIZE`, `STORAGE`, etc.) from `controller.ts` to dedicated Capability classes, adhering to the Single Responsibility Principle.
*   **Clean Modules**: Moved `src/modules/tokens/logic` to `src/modules/tokens/domain/services` to better reflect the Domain-Driven Design.
*   **Health Check**: Added `CheckHealthCapability` to expose token validation logic.
*   **Activity Layout**: Extracted full-screen layout logic for better UI modularity.
