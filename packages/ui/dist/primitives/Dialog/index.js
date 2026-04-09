import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
const MAX_W = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};
export function Dialog({ open, onClose, title, description, children, maxWidth = 'md', }) {
    const overlayRef = useRef(null);
    const titleId = React.useId();
    const descId = React.useId();
    // Close on Escape
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);
    // Prevent body scroll
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "presentation", children: [_jsx("div", { ref: overlayRef, className: "absolute inset-0 bg-black/60 animate-fade-in", onClick: onClose, "aria-hidden": "true" }), _jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": description ? descId : undefined, className: [
                    'relative w-full bg-elevated border border-border-default rounded-xl shadow-modal',
                    'animate-fade-in',
                    MAX_W[maxWidth],
                ].join(' '), onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between px-6 pt-5 pb-3 border-b border-border-subtle", children: [_jsx("h2", { id: titleId, className: "text-base font-bold text-primary", children: title }), _jsx("button", { onClick: onClose, className: "text-secondary hover:text-primary transition-colors ml-4", "aria-label": "Close dialog", children: "\u2715" })] }), _jsxs("div", { className: "px-6 py-4", children: [description && (_jsx("p", { id: descId, className: "text-sm text-secondary mb-4", children: description })), children] })] })] }));
}
//# sourceMappingURL=index.js.map