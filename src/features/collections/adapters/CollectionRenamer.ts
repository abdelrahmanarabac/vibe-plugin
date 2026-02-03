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

                } catch (collectionError: unknown) {
                    const message = collectionError instanceof Error ? collectionError.message : String(collectionError);
                    // Handle individual collection errors without stopping the batch
                    result.errors.push({
                        collectionId: collection.id,
                        error: message || 'Unknown error during classification/rename'
                    });
                    result.success = false;
                    console.error(
                        `Error processing collection '${collection.name}' (${collection.id}):`,
                        collectionError
                    );
                }
            }

        } catch (globalError: unknown) {
            const message = globalError instanceof Error ? globalError.message : String(globalError);
            // Handle fatal errors (e.g., API unavailable)
            result.success = false;
            result.errors.push({
                collectionId: 'GLOBAL',
                error: message || 'Failed to retrieve collections'
            });
            console.error('Fatal error in renameAll:', globalError);
        }

        return result;
    }

    // Helper for omnibox notifications
    private notify(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message, type }
        });
    }

    // ... inside renameById ...

    async renameById(collectionId: string): Promise<boolean> {
        try {
            const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);

            if (!collection) {
                this.notify(`❌ Collection not found (ID: ${collectionId})`, 'error');
                return false;
            }

            const classification = await this.classifier.classify(collection);

            // Check if classification is valid
            if (classification.proposedName === 'Unknown') {
                this.notify(`⚠️ Cannot classify '${collection.name}'. ${classification.reason}`, 'warning');
                return false;
            }

            // Check confidence
            if (classification.confidence < this.confidenceThreshold) {
                this.notify(`⚠️ Low confidence (${Math.round(classification.confidence * 100)}%). ${classification.reason}`, 'warning');
                return false;
            }

            // Check if already correct
            if (collection.name === classification.proposedName) {
                this.notify(`✅ '${collection.name}' already has the correct name`, 'success');
                return true;
            }

            // Apply rename
            const oldName = collection.name;
            collection.name = classification.proposedName;
            this.notify(`✅ Renamed '${oldName}' → '${classification.proposedName}'`, 'success');
            return true;

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            this.notify(`❌ Rename failed: ${message}`, 'error');
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

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Error in previewClassifications:', error);
            throw new Error(`Failed to generate preview: ${message}`);
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
