import { z } from "zod";
import type { ScannedPrimitive, VibeToken } from "./types";

// Updated Schema to accept Numbers (for Spacing/Radius) and Strings
const TokenSchema = z.object({
  name: z.string(),
  $value: z.union([z.string(), z.number(), z.record(z.unknown())]), // Flexible - Allows strings, numbers, or complex objects (Shadows, Typography)
  $type: z.string().optional().default("color"),
  description: z.string().optional()
});

export class SemanticIntelligence {
  static buildMappingPrompt(primitives: ScannedPrimitive[], vibe: string, history: unknown[] = []): string {
    return `
      SYSTEM ROLE: Design System Architect (Strict IO).
      OBJECTIVE: Generate a complete semantic token map JSON based on the provided Vibe and Primitives.
      
      INPUT_VIBE: "${vibe}"
      INPUT_PRIMITIVES_COUNT: ${primitives.length}
      PREVIOUS_DECISIONS: ${JSON.stringify(history, null, 0)}
      PRIMITIVES_SAMPLE: ${JSON.stringify(primitives.slice(0, 30), null, 0)}

      CRITICAL RULES:
      1. OUTPUT MUST BE A VALID JSON ARRAY.
      2. NO MARKDOWN FORMATTING (No \`\`\`json).
      3. START WITH [ AND END WITH ].
      
      MAPPING LOGIC:
      - Colors: Extract from primitives or generate based on vibe.
      - Radius: Standardize (0, 4, 8, 12, 16, 99).
      - Spacing: Standardize (4, 8, 12, 16, 24, 32, 48, 64).
      - Typography: Generate a Type Scale (Heading, Body, Caption) if fonts are detected.
      - Shadows: Generate elevation tokens if shadows are detected.

      REQUIRED JSON STRUCTURE EXAMPLES:
      [
        { "name": "Primary/Main", "$value": "#HEX", "$type": "color" },
        { "name": "Spacing/Base", "$value": 16, "$type": "spacing" },
        { "name": "Radius/Sm", "$value": 4, "$type": "borderRadius" },
        { "name": "Type/Head/XL", "$value": { "fontFamily": "Inter", "fontWeight": "Bold", "fontSize": 32, "lineHeight": 1.2, "letterSpacing": -1 }, "$type": "typography" }
      ]
    `;
  }

  static parseResponse(response: string): VibeToken[] {
    try {
      // 1. Surgical Extraction: Find the JSON array within the text
      const start = response.indexOf('[');
      const end = response.lastIndexOf(']');

      if (start === -1 || end === -1) {
        throw new Error("No JSON array found in response.");
      }

      const jsonStr = response.substring(start, end + 1);
      const parsed = JSON.parse(jsonStr);

      // 2. Validate with Zod
      const schema = z.array(TokenSchema);
      // We safely cast the result of parse because our Zod schema aligns with VibeToken (mostly)
      // Note: Zod return type for $value is string | number | Record<string, unknown> which matches TokenValue
      return schema.parse(parsed) as unknown as VibeToken[];
    } catch (e) {
      console.error("Parsing Error Details:", e);
      throw new Error(`AI Syntax Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}
