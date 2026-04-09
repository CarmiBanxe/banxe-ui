import React from 'react';
export type FlagType = 'AML' | 'SANCTIONS' | 'EDD' | 'SAR' | 'STRUCTURING';
interface ComplianceFlagProps {
    type: FlagType;
    note?: string;
    compact?: boolean;
}
/**
 * ComplianceFlag — compliance annotation on a transaction or account.
 * Always visible to authorized roles. Never hidden or styled away.
 */
export declare function ComplianceFlag({ type, note, compact }: ComplianceFlagProps): React.ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map