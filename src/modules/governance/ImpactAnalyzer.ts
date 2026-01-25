import { TokenRepository } from '../../core/TokenRepository';
import type { TokenEntity } from '../../core/types';

export interface ImpactReport {
    totalAffected: number;
    breakdown: Record<string, number>;
    tokens: TokenEntity[];
    severity: 'low' | 'medium' | 'high';
}

export class ImpactAnalyzer {
    private graph: TokenRepository;

    constructor(graph: TokenRepository) {
        this.graph = graph;
    }

    analyzeChange(tokenId: string): ImpactReport {
        const affectedTokens = this.graph.getImpact(tokenId);

        // Categorize by type
        const breakdown = affectedTokens.reduce((acc, token) => {
            acc[token.$type] = (acc[token.$type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalAffected = affectedTokens.length;

        let severity: 'low' | 'medium' | 'high' = 'low';
        if (totalAffected > 50) severity = 'high';
        else if (totalAffected > 10) severity = 'medium';

        return {
            totalAffected,
            breakdown,
            tokens: affectedTokens,
            severity
        };
    }

    // Alias for consistency
    analyzeImpact(tokenId: string): ImpactReport {
        return this.analyzeChange(tokenId);
    }
}
