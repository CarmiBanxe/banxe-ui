import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ variant = 'block', width, height, className = '', 'aria-label': ariaLabel, }) {
    const base = 'skeleton animate-shimmer bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface bg-[length:200%_100%]';
    const variantClass = {
        text: 'h-4 rounded-sm',
        block: 'rounded-lg',
        circle: 'rounded-full',
    }[variant];
    return (_jsx("div", { className: [base, variantClass, className].join(' '), style: { width, height }, role: "status", "aria-label": ariaLabel ?? 'Loading…', "aria-live": "polite" }));
}
/** Pre-composed skeleton for a single TransactionRow */
export function TransactionRowSkeleton() {
    return (_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border-subtle", children: [_jsx(Skeleton, { variant: "circle", width: "32px", height: "32px" }), _jsxs("div", { className: "flex-1 flex flex-col gap-1.5", children: [_jsx(Skeleton, { variant: "text", width: "40%" }), _jsx(Skeleton, { variant: "text", width: "60%", height: "10px" })] }), _jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [_jsx(Skeleton, { variant: "text", width: "64px" }), _jsx(Skeleton, { variant: "text", width: "48px", height: "10px" })] })] }));
}
/** Pre-composed skeleton for a BalanceWidget */
export function BalanceWidgetSkeleton() {
    return (_jsxs("div", { className: "p-6 rounded-xl bg-surface border border-border-subtle flex flex-col gap-3", children: [_jsx(Skeleton, { variant: "text", width: "80px", height: "12px" }), _jsx(Skeleton, { variant: "text", width: "200px", height: "36px" }), _jsxs("div", { className: "flex gap-6", children: [_jsx(Skeleton, { variant: "text", width: "120px", height: "12px" }), _jsx(Skeleton, { variant: "text", width: "120px", height: "12px" })] })] }));
}
//# sourceMappingURL=index.js.map