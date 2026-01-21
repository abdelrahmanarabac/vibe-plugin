// src/ui.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import './ui/theme/figma-tokens.css'; // Figma Native Theme
import './style.css'; // Legacy styles (will be phased out)
import { ErrorBoundary } from './ui/components/ErrorBoundary';

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
