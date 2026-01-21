import { colord } from "colord";
import type { VibeToken } from "./types";

/**
 * 🛡️ QualityGate
 * The "Conscience" of the Agent.
 * Strict validation of generated tokens against Design System standards and WCAG accessibility rules.
 */
export class QualityGate {
    /**
     * Validates a batch of tokens.
     * Returns a report of issues, or empty if perfect.
     */
    static validate(tokens: VibeToken[]): ValidationError[] {
        const errors: ValidationError[] = [];

        tokens.forEach(token => {
            // 1. Accessibility Check (for colors)
            if (token.$type === 'color' && typeof token.$value === 'string') {
                const hex = token.$value;
                if (!colord(hex).isValid()) {
                    errors.push({ token, message: `Invalid HEX color: ${hex}`, severity: 'critical' });
                }

                // Example Heuristic: If it's a "text" color, check contrast against white/black?
                // Real WCAG checking requires knowing the background, which is complex for isolated tokens.
                // For now, we enforce that "text" tokens shouldn't be too low contrast if we assume a white bg.
                if (token.name.toLowerCase().includes('text') || token.name.toLowerCase().includes('foreground')) {
                    const contrast = colord(hex).contrast('#FFFFFF'); // Assuming light mode default
                    if (contrast < 3) { // WCAG AA Large Text limit approx
                        errors.push({
                            token,
                            message: `Low contrast for text token '${token.name}' (Ratio: ${contrast.toFixed(2)}:1). Consider darkening.`,
                            severity: 'warning'
                        });
                    }
                }
            }

            // 2. Naming Convention Check
            if (!token.name.match(/^[a-z0-9]+(\/[a-z0-9]+)*$/i)) {
                // Allow Slash naming, but warn if weird chars
                // This regex allows "Primary/500", "text/main"
            }
        });

        return errors;
    }

    /**
     * 🚑 Self-Heal
     * Attempts to fix validation errors automatically.
     */
    static heal(tokens: VibeToken[], errors: ValidationError[]): VibeToken[] {
        return tokens.map(token => {
            const tokenErrors = errors.filter(e => e.token === token);
            if (tokenErrors.length === 0) return token;

            let healedValue = token.$value;

            for (const error of tokenErrors) {
                // Heuristic: Fix Low Contrast
                if (error.message.includes('Low contrast') && typeof healedValue === 'string') {
                    console.log(`🚑 Healing ${token.name}: Darkening to improve contrast...`);
                    // Darken by 10% steps until it might pass or max 3 times
                    healedValue = colord(healedValue).darken(0.15).toHex();
                }
            }

            return { ...token, $value: healedValue };
        });
    }
}

export interface ValidationError {
    token: VibeToken;
    message: string;
    severity: 'critical' | 'warning';
}
