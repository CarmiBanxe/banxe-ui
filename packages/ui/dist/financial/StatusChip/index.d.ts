import React from 'react';
export type ChipStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'BLOCKED' | 'REVIEW' | 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
interface StatusChipProps {
    status: ChipStatus;
    size?: 'sm' | 'md';
}
/**
 * StatusChip — status indicator with icon + text.
 * Never relies on color alone (WCAG 1.4.1).
 */
export declare function StatusChip({ status, size }: StatusChipProps): React.ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map