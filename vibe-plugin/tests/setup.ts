import { vi } from 'vitest';

// ----------------------------------------------------------------------------
// 🌍 GLOBAL FIGMA MOCK
// ----------------------------------------------------------------------------
// This mocks the global 'figma' object required by the Plugin API.
// It is automatically loaded by Vitest via vite.config.ts
// ----------------------------------------------------------------------------

const mockFigma = {
    mixed: Symbol('mixed'),
    // Add other global figma methods here as needed
    notify: vi.fn(),
    showUI: vi.fn(),
    ui: {
        postMessage: vi.fn(),
        onmessage: vi.fn(),
    },
    viewport: {
        center: 0,
        zoom: 1
    }
};

// Inject into global scope
(global as any).figma = mockFigma;

console.log('[Test Setup] Global Figma Mock Injected');
