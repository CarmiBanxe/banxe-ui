import React from 'react';
/**
 * Input — BANXE design system primitive
 *
 * Variants: default | monospace (amounts, IBANs, references)
 * States: default | focused | error | disabled
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
    monospace?: boolean;
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=index.d.ts.map