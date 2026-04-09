import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
/**
 * BalanceWidget — primary balance display component.
 *
 * Rules:
 * - Amounts always displayed as strings (Decimal-safe, no float)
 * - Privacy mode replaces amounts with "••••"
 * - Loading state uses skeleton (not spinner)
 * - Error state is inline (does not collapse the widget)
 */
export function BalanceWidget({ currency, total, available, pending, loading = false, error = false, }) {
    const [privacyMode, setPrivacyMode] = useState(false);
    const mask = (value) => (privacyMode ? '••••' : value);
    if (loading) {
        return (_jsxs("div", { className: "rounded-lg bg-surface p-6 animate-pulse", "aria-busy": "true", "aria-label": "Loading balance", children: [_jsx("div", { className: "h-3 w-20 bg-overlay rounded mb-3" }), _jsx("div", { className: "h-9 w-36 bg-overlay rounded mb-4" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "h-3 w-28 bg-overlay rounded" }), _jsx("div", { className: "h-3 w-24 bg-overlay rounded" })] })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "rounded-lg bg-surface p-6 border border-error-subtle", role: "alert", children: [_jsx("p", { className: "text-sm text-secondary", children: "Balance unavailable" }), _jsx("button", { className: "mt-2 text-sm text-brand-primary hover:underline", onClick: () => window.location.reload(), children: "Retry" })] }));
    }
    return (_jsxs("div", { className: "rounded-lg bg-surface p-6", children: [_jsxs("p", { className: "text-xs text-secondary uppercase tracking-wider mb-1", children: [currency, " Balance"] }), _jsxs("div", { className: "flex items-baseline gap-3 mb-4", children: [_jsx("span", { className: "text-3xl font-bold font-mono text-primary", "aria-label": `${mask(total)} ${currency} total balance`, children: mask(total) }), _jsx("button", { className: "text-xs text-secondary hover:text-primary transition-colors", onClick: () => setPrivacyMode((p) => !p), "aria-pressed": privacyMode, "aria-label": privacyMode ? 'Show balance' : 'Hide balance', children: privacyMode ? 'Show' : 'Hide' })] }), _jsxs("div", { className: "flex gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-secondary", children: "Available" }), _jsx("p", { className: "text-sm font-mono font-medium text-primary", "aria-label": `${mask(available)} ${currency} available`, children: mask(available) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-secondary", children: "Pending" }), _jsx("p", { className: "text-sm font-mono font-medium text-warning", "aria-label": `${mask(pending)} ${currency} pending`, children: mask(pending) })] })] })] }));
}
//# sourceMappingURL=index.js.map