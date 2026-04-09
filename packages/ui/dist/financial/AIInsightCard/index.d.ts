import React from 'react';
export type Confidence = 'HIGH' | 'MEDIUM' | 'UNCERTAIN';
interface AIInsightCardProps {
    insight: string;
    confidence: Confidence;
    explanation?: string;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
}
/**
 * AIInsightCard — AI-generated content block.
 *
 * Mandatory rules per BANXE-UI-UX-SYSTEM.md:
 * - ALWAYS shows AI badge
 * - ALWAYS shows confidence level
 * - ALWAYS provides explanation toggle ("Why this?")
 * - NEVER auto-acts — action requires explicit user click
 * - All content labeled "AI-generated" for screen readers
 */
export declare function AIInsightCard({ insight, confidence, explanation, actionLabel, onAction, onDismiss, }: AIInsightCardProps): React.ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map