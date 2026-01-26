import { describe, it, expect } from 'vitest';
import { SemanticIntelligence } from './SemanticIntelligence';

describe('SemanticIntelligence', () => {
    it('buildMappingPrompt should include naming convention and documentation instructions', () => {
        const prompt = SemanticIntelligence.buildMappingPrompt([], 'Cyberpunk', [], 'literal');

        expect(prompt).toContain('INPUT_NAMING_CONVENTION: "literal"');
        expect(prompt).toContain('description');
        expect(prompt).toContain('Use descriptive names like "blue-500"');
    });

    it('parseResponse should validate tokens with descriptions', () => {
        const jsonResponse = JSON.stringify([
            {
                name: "Primary/Main",
                $value: "#FF0000",
                $type: "color",
                description: "The main brand color."
            },
            {
                name: "Spacing/Small",
                $value: 8,
                $type: "spacing"
                // description is optional
            }
        ]);

        const tokens = SemanticIntelligence.parseResponse(`Here is the JSON: ${jsonResponse}`);

        expect(tokens).toHaveLength(2);
        expect(tokens[0].description).toBe("The main brand color.");
        expect(tokens[1].name).toBe("Spacing/Small");
    });
});
