/**
 * @module VibeWorkerClient
 * @description Secure proxy client to communicate with Vibe Cloudflare Worker.
 * Replaces direct Supabase client for sensitive operations.
 */

// 🔒 SECURE WORKER URL - No specific keys needed on client side
const WORKER_URL = 'https://fancy-dawn-0b10.abdelrahman-arab-ac.workers.dev';

export interface WorkerResponse<T> {
    data: T | null;
    error: string | null;
}

export class VibeWorkerClient {

    /**
     * Generic POST request wrapper
     */
    private static async post<T>(endpoint: string, body: any): Promise<WorkerResponse<T>> {
        try {
            const response = await fetch(`${WORKER_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const text = await response.text();
                return { data: null, error: `Worker Error ${response.status}: ${text}` };
            }

            const json = await response.json();

            // The worker wrapping convention based on user snippet:
            // return result.data; -> The snippet implies the worker returns { data: ... }
            // Let's assume the worker returns a structure we might need to normalize.
            // If the snippet says:
            // const result = await response.json();
            // return result.data;
            // Then we should probably just return the json directly if it matches our generic type,
            // or extract data.

            // User snippet analysis:
            // const result = await response.json();
            // return result.data;

            // So the raw JSON response contains a 'data' property.
            return { data: json.data, error: null };

        } catch (e: unknown) {
            console.error(`[VibeWorker] Request failed to ${endpoint}`, e);
            return { data: null, error: e instanceof Error ? e.message : String(e) };
        }
    }

    /**
     * Authenticates a user via the Worker Proxy.
     */
    static async signIn(email: string, password: string): Promise<WorkerResponse<any>> {
        return this.post('/auth', {
            type: 'signin',
            email,
            password
        });
    }

    /**
     * Syncs generic data to Supabase tables via the Worker Proxy.
     */
    static async syncTokens(data: any): Promise<WorkerResponse<any>> {
        return this.post('/sync', {
            table: 'tokens',
            method: 'POST', // or UPSERT based on worker logic
            data: data
        });
    }

    /**
     * Helper to ping the worker or check health if needed.
     */
    static async healthCheck(): Promise<boolean> {
        try {
            const res = await fetch(`${WORKER_URL}/`);
            return res.ok;
        } catch {
            return false;
        }
    }
}
