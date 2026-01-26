import { CollectionClassifier } from '../logic/CollectionClassifier';
import type { RenameResult, CollectionClassification } from '../types';

/**
 * CollectionRenamer: Adapter Layer for Figma API Integration
 * 
 * Responsibility: Orchestrate the classification and renaming of Figma Variable Collections.
 * This class acts as the boundary between our domain logic (CollectionClassifier) and
 * the Figma Plugin API.
 * 
 * Design Pattern: Adapter Pattern
 * - CollectionClassifier (Business Logic) remains pure and testable
 * - CollectionRenamer (Adapter) handles Figma API specifics and error handling
 */
export class CollectionRenamer {
    private classifier: CollectionClassifier;
    private confidenceThreshold: number = 0.7;

    constructor() {
        this.classifier = new CollectionClassifier();
    }

    /**
     * Automatically renames all local variable collections based on classification.
     * 
     * Algorithm:
     * 1. Fetch all local collections from Figma
     * 2. Classify each collection using CollectionClassifier
     * 3. Filter by confidence threshold (default: 0.7)
     * 4. Apply renames via Figma API
     * 5. Return comprehensive result report
     * 
     * @param dryRun - If true, simulates rename without applying changes (for preview)
     * @returns RenameResult with success status, counts, and error details
     */
    async renameAll(dryRun: boolean = false): Promise<RenameResult> {
        const result: RenameResult = {
            success: true,
            renamedCount: 0,
            skippedCount: 0,
            errors: []
        };

        try {
            // Fetch all local collections
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            // Handle case where no collections exist
            if (collections.length === 0) {
                console.warn('No variable collections found in document');
                return result;
            }

            // Process each collection
            for (const collection of collections) {
                try {
                    const classification = await this.classifier.classify(collection);

                    // Skip if confidence too low
                    if (classification.confidence < this.confidenceThreshold) {
                        result.skippedCount++;
                        console.warn(
                            `Skipped '${collection.name}': ${classification.reason} (confidence: ${classification.confidence.toFixed(2)})`
                        );
                        continue;
                    }

                    // Skip if classification is Unknown
                    if (classification.proposedName === 'Unknown') {
                        result.skippedCount++;
                        console.warn(
                            `Skipped '${collection.name}': ${classification.reason}`
                        );
                        continue;
                    }

                    // Skip if already has correct name
                    if (collection.name === classification.proposedName) {
                        result.skippedCount++;
                        console.log(
                            `Skipped '${collection.name}': Already has correct name`
                        );
                        continue;
                    }

                    // Apply rename (or simulate if dry run)
                    if (!dryRun) {
                        // Check for name collision
                        const existingCollection = collections.find(
                            c => c.name === classification.proposedName && c.id !== collection.id
                        );

                        if (existingCollection) {
                            // Handle collision: append suffix
                            let suffix = 1;
                            let proposedName = `${classification.proposedName}_${suffix}`;
                            while (collections.some(c => c.name === proposedName && c.id !== collection.id)) {
                                suffix++;
                                proposedName = `${classification.proposedName}_${suffix}`;
                            }

                            collection.name = proposedName;
                            result.renamedCount++;
                            console.warn(
                                `⚠️ Name collision detected. Renamed '${classification.currentName}' → '${proposedName}' (${classification.reason})`
                            );
                        } else {
                            // No collision: apply clean rename
                            collection.name = classification.proposedName;
                            result.renamedCount++;
                            console.log(
                                `✅ Renamed '${classification.currentName}' → '${classification.proposedName}' (${classification.reason})`
                            );
                        }
                    } else {
                        // Dry run: just log what would happen
                        console.log(
                            `[DRY RUN] Would rename '${classification.currentName}' → '${classification.proposedName}' (confidence: ${classification.confidence.toFixed(2)})`
                        );
                        result.renamedCount++;
                    }

                } catch (collectionError: any) {
                    // Handle individual collection errors without stopping the batch
                    result.errors.push({
                        collectionId: collection.id,
                        error: collectionError.message || 'Unknown error during classification/rename'
                    });
                    result.success = false;
                    console.error(
                        `Error processing collection '${collection.name}' (${collection.id}):`,
                        collectionError
                    );
                }
            }

        } catch (globalError: any) {
            // Handle fatal errors (e.g., API unavailable)
            result.success = false;
            result.errors.push({
                collectionId: 'GLOBAL',
                error: globalError.message || 'Failed to retrieve collections'
            });
            console.error('Fatal error in renameAll:', globalError);
        }

        return result;
    }

    /**
     * Renames a specific collection by ID.
     * 
     * Use case: User manually triggers rename on a single collection via UI.
     * 
     * @param collectionId - Figma Variable Collection ID
     * @returns true if renamed successfully, false otherwise
     */
    async renameById(collectionId: string): Promise<boolean> {
        try {
            const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);

            if (!collection) {
                figma.notify(`❌ Collection not found (ID: ${collectionId})`, { error: true });
                return false;
            }

            const classification = await this.classifier.classify(collection);

            // Check if classification is valid
            if (classification.proposedName === 'Unknown') {
                figma.notify(
                    `⚠️ Cannot classify '${collection.name}'. ${classification.reason}`,
                    { error: false, timeout: 5000 }
                );
                return false;
            }

            // Check confidence
            if (classification.confidence < this.confidenceThreshold) {
                figma.notify(
                    `⚠️ Low confidence (${Math.round(classification.confidence * 100)}%). ${classification.reason}`,
                    { error: false, timeout: 5000 }
                );
                return false;
            }

            // Check if already correct
            if (collection.name === classification.proposedName) {
                figma.notify(
                    `✅ '${collection.name}' already has the correct name`,
                    { timeout: 3000 }
                );
                return true;
            }

            // Apply rename
            const oldName = collection.name;
            collection.name = classification.proposedName;
            figma.notify(
                `✅ Renamed '${oldName}' → '${classification.proposedName}'`,
                { timeout: 3000 }
            );
            return true;

        } catch (error: any) {
            figma.notify(
                `❌ Rename failed: ${error.message}`,
                { error: true, timeout: 5000 }
            );
            console.error('Error in renameById:', error);
            return false;
        }
    }

    /**
     * Preview classification results without applying changes.
     * 
     * Use case: Show user what would be renamed before confirming action.
     * 
     * @returns Array of CollectionClassification results
     */
    async previewClassifications(): Promise<CollectionClassification[]> {
        const results: CollectionClassification[] = [];

        try {
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            for (const collection of collections) {
                const classification = await this.classifier.classify(collection);
                results.push(classification);
            }

        } catch (error: any) {
            console.error('Error in previewClassifications:', error);
            throw new Error(`Failed to generate preview: ${error.message}`);
        }

        return results;
    }

    /**
     * Update the confidence threshold used for auto-rename decisions.
     * 
     * @param threshold - New confidence threshold (0.0 to 1.0)
     */
    setConfidenceThreshold(threshold: number): void {
        if (threshold < 0 || threshold > 1) {
            throw new Error('Confidence threshold must be between 0.0 and 1.0');
        }
        this.confidenceThreshold = threshold;
    }

    /**
     * Get current confidence threshold.
     */
    getConfidenceThreshold(): number {
        return this.confidenceThreshold;
    }
}
