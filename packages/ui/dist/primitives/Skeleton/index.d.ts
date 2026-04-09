import React from 'react';
/**
 * Skeleton — loading placeholder primitive
 *
 * Rule: NEVER use spinner-only loading states.
 * Always use skeleton screens that match the layout of the loaded content.
 *
 * Variants:
 * - text: single line of text
 * - block: rectangular area (cards, images)
 * - circle: avatar, icon placeholder
 */
export interface SkeletonProps {
    variant?: 'text' | 'block' | 'circle';
    width?: string;
    height?: string;
    className?: string;
    'aria-label'?: string;
}
export declare function Skeleton({ variant, width, height, className, 'aria-label': ariaLabel, }: SkeletonProps): React.ReactElement;
/** Pre-composed skeleton for a single TransactionRow */
export declare function TransactionRowSkeleton(): React.ReactElement;
/** Pre-composed skeleton for a BalanceWidget */
export declare function BalanceWidgetSkeleton(): React.ReactElement;
//# sourceMappingURL=index.d.ts.map