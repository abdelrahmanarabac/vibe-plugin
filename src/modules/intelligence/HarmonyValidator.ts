import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { type TokenEntity } from '../../core/types';

extend([a11yPlugin]);

export interface Issue {
    type: 'CONTRAST' | 'NAMING' | 'MISSING_VALUE';
    message: string;
    severity: 'WARNING' | 'ERROR';
}

/**
 * ⚖️ HarmonyValidator
 * Deterministic rule engine for design tokens.
 * Checks for WCAG contrast compliance and naming conventions.
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

        // 2. Value/Contrast Logic (Simplified for MVP)
        // In a real system, we'd check if it's a color and compare against a background.
        // For now, we'll just check if the value is defined.
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
