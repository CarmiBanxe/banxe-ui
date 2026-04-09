import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const VARIANT_CLASSES = {
    primary: 'bg-brand-primary text-inverse hover:bg-brand-light active:opacity-90 disabled:opacity-50',
    secondary: 'bg-surface border border-border-default text-primary hover:bg-overlay active:opacity-90 disabled:opacity-50',
    ghost: 'bg-transparent text-secondary hover:text-primary hover:bg-overlay active:opacity-90 disabled:opacity-50',
    destructive: 'bg-error text-inverse hover:opacity-90 active:opacity-80 disabled:opacity-50',
};
const SIZE_CLASSES = {
    sm: 'h-7 px-3 text-xs rounded-md gap-1.5',
    md: 'h-9 px-4 text-sm rounded-lg gap-2',
    lg: 'h-11 px-5 text-base rounded-lg gap-2',
};
export const Button = React.forwardRef(({ variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, children, className = '', disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (_jsxs("button", { ref: ref, disabled: isDisabled, "aria-busy": loading, className: [
            'inline-flex items-center justify-center font-medium transition-colors cursor-pointer',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2',
            'disabled:cursor-not-allowed',
            VARIANT_CLASSES[variant],
            SIZE_CLASSES[size],
            className,
        ].join(' '), ...props, children: [loading && (_jsx("span", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0", "aria-hidden": "true" })), !loading && leftIcon && (_jsx("span", { className: "flex-shrink-0", "aria-hidden": "true", children: leftIcon })), children, !loading && rightIcon && (_jsx("span", { className: "flex-shrink-0", "aria-hidden": "true", children: rightIcon }))] }));
});
Button.displayName = 'Button';
//# sourceMappingURL=index.js.map