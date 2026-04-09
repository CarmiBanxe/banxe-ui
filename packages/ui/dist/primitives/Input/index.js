import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Input = React.forwardRef(({ label, hint, error, monospace = false, leftAdornment, rightAdornment, id, className = '', disabled, ...props }, ref) => {
    const inputId = id ?? React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-xs font-medium text-secondary", children: label })), _jsxs("div", { className: `relative flex items-center ${error ? 'ring-1 ring-error' : ''} rounded-lg`, children: [leftAdornment && (_jsx("span", { className: "absolute left-3 text-secondary pointer-events-none", "aria-hidden": "true", children: leftAdornment })), _jsx("input", { ref: ref, id: inputId, disabled: disabled, "aria-invalid": !!error, "aria-describedby": [errorId, hintId].filter(Boolean).join(' ') || undefined, className: [
                            'w-full bg-surface border rounded-lg text-primary transition-colors',
                            'placeholder:text-disabled',
                            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            error ? 'border-error' : 'border-border-default',
                            monospace ? 'font-mono' : '',
                            leftAdornment ? 'pl-9' : 'pl-3',
                            rightAdornment ? 'pr-9' : 'pr-3',
                            'py-2 text-sm',
                            className,
                        ].join(' '), ...props }), rightAdornment && (_jsx("span", { className: "absolute right-3 text-secondary", "aria-hidden": "true", children: rightAdornment }))] }), hint && !error && (_jsx("p", { id: hintId, className: "text-xs text-secondary", children: hint })), error && (_jsx("p", { id: errorId, className: "text-xs text-error", role: "alert", children: error }))] }));
});
Input.displayName = 'Input';
//# sourceMappingURL=index.js.map