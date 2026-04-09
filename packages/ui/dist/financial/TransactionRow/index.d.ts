import React from 'react';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'BLOCKED' | 'REVIEW';
interface TransactionRowProps {
    counterparty: string;
    reference?: string;
    amount: string;
    currency: string;
    direction: 'IN' | 'OUT';
    status: TransactionStatus;
    date: string;
}
/**
 * TransactionRow — single transaction list item.
 *
 * Amount is always a string (Decimal-safe).
 * Status chip includes text (not color alone) for accessibility.
 * Minimum height: 64px.
 */
export declare function TransactionRow({ counterparty, reference, amount, currency, direction, status, date, }: TransactionRowProps): React.ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map