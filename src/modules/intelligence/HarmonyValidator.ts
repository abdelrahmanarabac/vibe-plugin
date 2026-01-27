import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { type TokenEntity } from '../../core/types';


extend([a11yPlugin]);

export interface Issue {
    type: 'CONTRAST' | 'NAMING' | 'MISSING_VALUE';
    message: string;
    severity: 'WARNING' | 'ERROR';
    affectedTokens?: string[];
}

/**
 * ⚖️ HarmonyValidator
 * Deterministic rule engine for design tokens.
 * Checks for WCAG contrast compliance and naming conventions.
 * Now enhanced with [Harmony Healer] deep contrast checks.
 */
export class HarmonyValidator {

    /**
     * validate
     * Runs all static checks on a token.
     */
    static validate(token: TokenEntity): Issue[] {
        const issues: Issue[] = [];

        // 1. Naming Convention Check
        if (!this.checkNaming(token.name)) {
            issues.push({
                type: 'NAMING',
                message: 'Name does not follow "category-element-variant" pattern.',
                severity: 'WARNING'
            });
        }

        // 2. Value/Contrast Logic
        if (!token.$value) {
            issues.push({
                type: 'MISSING_VALUE',
                message: 'Token has no value.',
                severity: 'ERROR'
            });
        }

        return issues;
    }

    /**
     * 🩺 Validate Contrast (Harmony Healer)
     * Checks if a proposed color change breaks contrast for dependent text tokens.
     */
    static validateContrast(
        targetToken: TokenEntity,
        newValue: string,
        dependents: TokenEntity[]
    ): Issue[] {
        const issues: Issue[] = [];
        if (targetToken.$type !== 'color') return issues;

        for (const dep of dependents) {
            // Only care about colors
            if (dep.$type !== 'color') continue;

            // Heuristic: Is one likely a background and the other text?
            // If the dependent name contains "text" or "fg", check it against the new bg.
            // If the target name contains "text" or "fg", check it against the dependent bg.

            let fg = '';
            let bg = '';
            let isCheckable = false;

            // Scenario A: Changing Background (Target), Checking Dependent Text
            if (this.isText(dep.name) && !this.isText(targetToken.name)) {
                fg = dep.$value as string;
                bg = newValue;
                isCheckable = true;
            }
            // Scenario B: Changing Text (Target), Checking Dependent Background
            else if (this.isText(targetToken.name) && !this.isText(dep.name)) {
                fg = newValue;
                bg = dep.$value as string;
                isCheckable = true;
            }

            if (isCheckable) {
                // Use ColorScience/Colord for APCA or WCAG
                // Using Colord's simple WCAG 2.1 for now
                const ratio = colord(bg).contrast(fg);
                if (ratio < 4.5) {
                    issues.push({
                        type: 'CONTRAST',
                        severity: 'ERROR',
                        message: `Accessibility Regression: Changing ${targetToken.name} breaks contrast for ${dep.name} (Ratio: ${ratio.toFixed(2)}:1)`,
                        affectedTokens: [dep.name]
                    });
                }
            }
        }

        return issues;
    }

    private static isText(name: string): boolean {
        return name.toLowerCase().includes('text') || name.toLowerCase().includes('fg') || name.toLowerCase().includes('content');
    }

    /**
     * Check if name matches kebab-case 3-part structure.
     */
    private static checkNaming(name: string): boolean {
        const regex = /^[a-z]+-[a-z]+-[a-z0-9]+$/;
        return regex.test(name);
    }

    /**
     * Check contrast between two colors.
     * Returns true if WCAG AA compliant (4.5:1).
     */
    static checkContrast(fg: string, bg: string): boolean {
        return colord(bg).contrast(fg) >= 4.5;
    }
}
