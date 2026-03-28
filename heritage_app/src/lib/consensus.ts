export interface ReviewQueueFilters {
    tribe?: string;
    language?: string;
    region?: string;
}

/**
 * Calculates a vote's weight based on reviewer familiarity and anti-collusion logic.
 */
export function calculateVoteWeight(
    familiarityScore: number, 
    hasSocialConnection: boolean
): number {
    let weight = 1.0;

    // Penalty for self-assessed uncertainty (score below 3)
    if (familiarityScore < 3) {
        weight *= 0.5;
    }

    // Anti-collusion measure: social-graph separation rule
    if (hasSocialConnection) {
        weight *= 0.5;
    }

    return weight; // Example output: 0.25 (both), 0.5 (one penalty), or 1.0 (no penalty)
}

/**
 * Determines if a pending entry should be promoted based on current valid votes.
 */
export function evaluateConsensusThreshold(
    totalWeight: number,
    communitySize: number = 100 // Default community size
): boolean {
    const requiredThreshold = communitySize < 20 ? 3 : 5; // Adaptive threshold example
    return totalWeight >= requiredThreshold;
}
