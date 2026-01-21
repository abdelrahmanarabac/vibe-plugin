// src/ui.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css'; // لو عايز الاستايل
import { ErrorBoundary } from './ui/components/ErrorBoundary';

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
