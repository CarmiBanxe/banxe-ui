import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
const FLAG_CONFIG = {
    AML: { label: 'AML Review', detail: 'AML monitoring triggered', className: 'border-warning text-warning bg-warning-subtle' },
    SANCTIONS: { label: 'Sanctions Hit', detail: 'Sanctions check match', className: 'border-error text-error bg-error-subtle' },
    EDD: { label: 'EDD Required', detail: 'Enhanced due diligence required', className: 'border-warning text-warning bg-warning-subtle' },
    SAR: { label: 'SAR Filed', detail: 'Suspicious activity report filed', className: 'border-error text-error bg-error-subtle' },
    STRUCTURING: { label: 'Structuring', detail: 'Possible structuring detected', className: 'border-warning text-warning bg-warning-subtle' },
};
/**
 * ComplianceFlag — compliance annotation on a transaction or account.
 * Always visible to authorized roles. Never hidden or styled away.
 */
export function ComplianceFlag({ type, note, compact = false }) {
    const { label, detail, className } = FLAG_CONFIG[type];
    if (compact) {
        return (_jsxs("span", { role: "img", "aria-label": `Compliance flag: ${label}`, title: note ?? detail, className: `inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded border ${className}`, children: ["\u2691 ", label] }));
    }
    return (_jsxs("div", { role: "alert", "aria-label": `Compliance flag: ${label}`, className: `rounded-md border px-3 py-2 text-sm ${className}`, children: [_jsxs("p", { className: "font-semibold", children: ["\u2691 ", label] }), _jsx("p", { className: "text-xs mt-0.5 opacity-80", children: note ?? detail })] }));
}
//# sourceMappingURL=index.js.map