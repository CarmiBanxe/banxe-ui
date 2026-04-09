import React from 'react';
/**
 * Dialog — BANXE design system primitive
 *
 * Lightweight modal dialog with focus trap + Escape to close.
 * Note: Radix UI Dialog is preferred in production (installed via @radix-ui/react-dialog).
 * This is a self-contained fallback for dev prototype.
 */
export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg';
}
export declare function Dialog({ open, onClose, title, description, children, maxWidth, }: DialogProps): React.ReactElement | null;
//# sourceMappingURL=index.d.ts.map