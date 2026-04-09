import React from 'react';
interface AmountInputProps {
    currency: string;
    value: string;
    onChange: (value: string) => void;
    available?: string;
    label?: string;
    disabled?: boolean;
    error?: string;
}
/**
 * AmountInput — financial amount entry field.
 *
 * Rules:
 * - Value is always a string (Decimal-safe, never float)
 * - Accepts only valid decimal input (up to 2 decimal places)
 * - Shows available balance as live hint
 * - Error state is explicit and accessible
 */
export declare function AmountInput({ currency, value, onChange, available, label, disabled, error, }: AmountInputProps): React.ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map