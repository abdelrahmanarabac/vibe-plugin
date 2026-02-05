/**
 * 📊 Performance Monitor
 * 
 * Tracks and reports performance metrics:
 * - Frame drops (FPS)
 * - Long tasks (>50ms)
 * - Memory usage
 * - Sync duration
 * 
 * ARCHITECTURE: UI Layer Utility
 */

import React from 'react';

export interface PerformanceMetrics {
    fps: number;
    droppedFrames: number;
    longTasks: number;
    averageTaskDuration: number;
    memoryUsage?: {
        used: number;
        total: number;
        percentage: number;
    };
}

export class PerformanceMonitor {
    private isMonitoring = false;
    private frameCount = 0;
    private lastFrameTime = 0;
    private fpsHistory: number[] = [];
    private droppedFrames = 0;
    private longTasks: number[] = [];
    private rafId: number | null = null;
    private observer: PerformanceObserver | null = null;

    // Target 60fps = 16.67ms per frame
    private readonly TARGET_FRAME_TIME = 1000 / 60;
    private readonly LONG_TASK_THRESHOLD = 50; // MS

    /**
     * Start monitoring
     */
    start(): void {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.frameCount = 0;
        this.droppedFrames = 0;
        this.longTasks = [];
        this.fpsHistory = [];
        this.lastFrameTime = performance.now();

        this.monitorFrame();
        this.setupPerformanceObserver();
    }

    /**
     * Stop monitoring
     */
    stop(): void {
        this.isMonitoring = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    /**
     * Monitor frame rate
     */
    private monitorFrame = (): void => {
        if (!this.isMonitoring) return;

        const now = performance.now();
        const delta = now - this.lastFrameTime;

        // Calculate FPS
        const fps = 1000 / delta;
        this.fpsHistory.push(fps);

        // Keep only last 60 samples (1 second worth)
        if (this.fpsHistory.length > 60) {
            this.fpsHistory.shift();
        }

        // Detect dropped frames (frame took longer than target)
        if (delta > this.TARGET_FRAME_TIME * 2) {
            this.droppedFrames++;
        }

        this.frameCount++;
        this.lastFrameTime = now;

        this.rafId = requestAnimationFrame(this.monitorFrame);
    };

    /**
     * Setup Performance Observer for long tasks
     */
    private setupPerformanceObserver(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            this.observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > this.LONG_TASK_THRESHOLD) {
                        this.longTasks.push(entry.duration);
                        console.warn(
                            `[PerformanceMonitor] Long task detected: ${entry.duration.toFixed(2)}ms`,
                            entry
                        );
                    }
                }
            });

            // Observe long tasks
            this.observer.observe({ entryTypes: ['longtask', 'measure'] });
        } catch (e) {
            // PerformanceObserver not supported
            console.log('[PerformanceMonitor] PerformanceObserver not available or failed to start');
        }
    }

    /**
     * Get current metrics
     */
    getMetrics(): PerformanceMetrics {
        const avgFps = this.fpsHistory.length > 0
            ? this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
            : 0;

        const avgTaskDuration = this.longTasks.length > 0
            ? this.longTasks.reduce((a, b) => a + b, 0) / this.longTasks.length
            : 0;

        const metrics: PerformanceMetrics = {
            fps: Math.round(avgFps),
            droppedFrames: this.droppedFrames,
            longTasks: this.longTasks.length,
            averageTaskDuration: Math.round(avgTaskDuration)
        };

        // Add memory info if available
        // Note: performance.memory is a non-standard Chrome extension
        const perf = performance as any;
        if (perf.memory) {
            metrics.memoryUsage = {
                used: Math.round(perf.memory.usedJSHeapSize / 1024 / 1024), // MB
                total: Math.round(perf.memory.totalJSHeapSize / 1024 / 1024), // MB
                percentage: Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100)
            };
        }

        return metrics;
    }

    /**
     * Reset metrics
     */
    reset(): void {
        this.frameCount = 0;
        this.droppedFrames = 0;
        this.longTasks = [];
        this.fpsHistory = [];
    }
}

/**
 * Measure function execution time
 */
export async function measureAsync<T>(
    label: string,
    fn: () => Promise<T>
): Promise<T> {
    const start = performance.now();

    try {
        const result = await fn();
        const duration = performance.now() - start;

        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);

        return result;
    } catch (error) {
        const duration = performance.now() - start;
        console.error(`❌ ${label} failed after ${duration.toFixed(2)}ms`, error);
        throw error;
    }
}

// Export singleton
export const perfMonitor = new PerformanceMonitor();

// React Hook for performance monitoring
export function usePerformanceMonitor() {
    const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

    React.useEffect(() => {
        perfMonitor.start();

        const interval = setInterval(() => {
            setMetrics(perfMonitor.getMetrics());
        }, 1000);

        return () => {
            clearInterval(interval);
            perfMonitor.stop();
        };
    }, []);

    return metrics;
}
