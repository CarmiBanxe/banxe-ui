import React from 'react';
interface BalanceWidgetProps {
    currency: string;
    total: string;
    available: string;
    pending: string;
    loading?: boolean;
    error?: boolean;
}
/**
 * BalanceWidget — primary balance display component.
 *
 * Rules:
 * - Amounts always displayed as strings (Decimal-safe, no float)
 * - Privacy mode replaces amounts with "••••"
 * - Loading state uses skeleton (not spinner)
 * - Error state is inline (does not collapse the widget)
 */
export declare function BalanceWidget({ currency, total, available, pending, loading, error, }: BalanceWidgetProps): React.ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map