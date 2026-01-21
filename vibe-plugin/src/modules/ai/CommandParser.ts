import { z } from 'zod';
import { AIOrchestrator } from '../ai/AIOrchestrator';

// Define the supported command structure
export const CommandSchema = z.object({
    action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'SELECT']),
    target: z.enum(['COLOR', 'TYPOGRAPHY', 'SPACING', 'RADIUS', 'ALL']),
    parameters: z.record(z.string(), z.any()), // Flexible params: { hex: "#...", value: 10 }

    description: z.string().optional() // Reasoning
});

export type Command = z.infer<typeof CommandSchema>;

export class CommandParser {
    private aiOrchestrator: AIOrchestrator;

    constructor(ai: AIOrchestrator) {
        this.aiOrchestrator = ai;
    }

    /**
     * Parses a natural language string into a structured Command.
     */
    async parse(input: string): Promise<Command | null> {
        const prompt = `
      You are a Command Parser for a Design System OS.
      Convert the following user request into a JSON command.
      
      User Request: "${input}"
      
      Schema:
      {
        "action": "CREATE" | "UPDATE" | "DELETE" | "SELECT",
        "target": "COLOR" | "TYPOGRAPHY" | "SPACING" | "RADIUS" | "ALL",
        "parameters": { ...kv pairs... },
        "description": "Short explanation of what will happen"
      }
      
      Examples:
      - "Make all buttons blue" -> { "action": "UPDATE", "target": "COLOR", "parameters": { "hex": "#0000FF", "scope": "button" } }
      - "Delete all unused colors" -> { "action": "DELETE", "target": "COLOR", "parameters": { "filter": "unused" } }
      
      Output ONLY valid JSON.
    `;

        try {
            const rawResponse = await this.aiOrchestrator.execute('nl-command', prompt);
            const jsonStr = rawResponse.replace(/```json|```/g, '').trim();

            const parsed = JSON.parse(jsonStr);

            // Validate schema
            const result = CommandSchema.safeParse(parsed);

            if (result.success) {
                return result.data;
            } else {
                console.error('Command validation failed:', result.error);
                return null; // Or throw custom error
            }
        } catch (error) {
            console.error('Failed to parse command:', error);
            return null;
        }
    }
}
