import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const CONFIDENCE_CONFIG = {
    HIGH: { label: 'High confidence', className: 'text-success' },
    MEDIUM: { label: 'Medium confidence', className: 'text-warning' },
    UNCERTAIN: { label: 'Uncertain', className: 'text-secondary' },
};
/**
 * AIInsightCard — AI-generated content block.
 *
 * Mandatory rules per BANXE-UI-UX-SYSTEM.md:
 * - ALWAYS shows AI badge
 * - ALWAYS shows confidence level
 * - ALWAYS provides explanation toggle ("Why this?")
 * - NEVER auto-acts — action requires explicit user click
 * - All content labeled "AI-generated" for screen readers
 */
export function AIInsightCard({ insight, confidence, explanation, actionLabel, onAction, onDismiss, }) {
    const [showExplanation, setShowExplanation] = useState(false);
    const { label: confLabel, className: confClass } = CONFIDENCE_CONFIG[confidence];
    return (_jsxs("section", { "aria-label": "AI-generated insight", className: "rounded-lg bg-ai-subtle border border-ai-accent/20 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-ai-accent/20 text-ai-accent", "aria-label": "AI-generated content", children: "BANXE AI" }), _jsx("span", { className: `text-xs font-medium ${confClass}`, children: confLabel })] }), onDismiss && (_jsx("button", { onClick: onDismiss, className: "text-xs text-secondary hover:text-primary transition-colors", "aria-label": "Dismiss AI insight", children: "Dismiss" }))] }), _jsx("p", { className: "text-sm text-primary leading-relaxed", children: insight }), explanation && (_jsxs("div", { className: "mt-2", children: [_jsx("button", { onClick: () => setShowExplanation((s) => !s), className: "text-xs text-brand-primary hover:underline", "aria-expanded": showExplanation, children: showExplanation ? 'Hide explanation' : 'Why this?' }), showExplanation && (_jsx("p", { className: "mt-1.5 text-xs text-secondary leading-relaxed border-l-2 border-ai-accent/30 pl-3", children: explanation }))] })), actionLabel && onAction && (_jsx("div", { className: "mt-3", children: _jsx("button", { onClick: onAction, className: "text-xs font-medium px-3 py-1.5 rounded-md bg-brand-subtle text-brand-primary hover:bg-brand-primary hover:text-white transition-colors", children: actionLabel }) }))] }));
}
//# sourceMappingURL=index.js.map