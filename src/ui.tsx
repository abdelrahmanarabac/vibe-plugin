// src/ui.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import './ui/theme/figma-tokens.css'; // Figma Native Theme + Vibe System
import { ErrorBoundary } from './ui/components/ErrorBoundary';

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
