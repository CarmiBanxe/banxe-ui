import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CONFIG = {
    COMPLETED: { label: 'Completed', icon: '✓', className: 'bg-success-subtle text-success border-transparent' },
    PENDING: { label: 'Pending', icon: '○', className: 'bg-warning-subtle text-warning border-transparent' },
    FAILED: { label: 'Failed', icon: '✕', className: 'bg-error-subtle text-error border-transparent' },
    BLOCKED: { label: 'Blocked', icon: '⊘', className: 'bg-error-subtle text-error border border-error' },
    REVIEW: { label: 'Review', icon: '⚑', className: 'bg-warning-subtle text-warning border border-warning' },
    ACTIVE: { label: 'Active', icon: '●', className: 'bg-success-subtle text-success border-transparent' },
    RESTRICTED: { label: 'Restricted', icon: '⚠', className: 'bg-warning-subtle text-warning border border-warning' },
    SUSPENDED: { label: 'Suspended', icon: '⊘', className: 'bg-error-subtle text-error border-transparent' },
};
const SIZE = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2 py-1 gap-1.5',
};
/**
 * StatusChip — status indicator with icon + text.
 * Never relies on color alone (WCAG 1.4.1).
 */
export function StatusChip({ status, size = 'sm' }) {
    const { label, icon, className } = CONFIG[status];
    return (_jsxs("span", { role: "status", "aria-label": `Status: ${label}`, className: `inline-flex items-center rounded font-medium border ${className} ${SIZE[size]}`, children: [_jsx("span", { "aria-hidden": "true", children: icon }), label] }));
}
//# sourceMappingURL=index.js.map