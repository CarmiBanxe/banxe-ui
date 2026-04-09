import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState, useCallback } from 'react';
const DECIMAL_RE = /^\d*\.?\d{0,2}$/;
/**
 * AmountInput — financial amount entry field.
 *
 * Rules:
 * - Value is always a string (Decimal-safe, never float)
 * - Accepts only valid decimal input (up to 2 decimal places)
 * - Shows available balance as live hint
 * - Error state is explicit and accessible
 */
export function AmountInput({ currency, value, onChange, available, label = 'Amount', disabled = false, error, }) {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const [raw, setRaw] = useState(value);
    const handleChange = useCallback((e) => {
        const v = e.target.value;
        if (v === '' || DECIMAL_RE.test(v)) {
            setRaw(v);
            onChange(v);
        }
    }, [onChange]);
    const isOverBalance = available !== undefined &&
        raw !== '' &&
        parseFloat(raw) > parseFloat(available);
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: id, className: "text-sm font-medium text-secondary", children: label }), _jsxs("div", { className: `
          flex items-center rounded-md border bg-surface px-3 py-2 gap-2
          focus-within:border-brand-primary
          ${error || isOverBalance ? 'border-error' : 'border-border-default'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `, children: [_jsx("span", { className: "text-sm font-semibold text-secondary w-8 flex-shrink-0", children: currency }), _jsx("input", { id: id, type: "text", inputMode: "decimal", value: raw, onChange: handleChange, disabled: disabled, placeholder: "0.00", "aria-describedby": `${hintId} ${error ? errorId : ''}`.trim(), "aria-invalid": !!error || isOverBalance, className: "flex-1 bg-transparent font-mono text-xl font-bold text-primary outline-none placeholder:text-disabled" })] }), available !== undefined && (_jsx("p", { id: hintId, className: `text-xs ${isOverBalance ? 'text-error' : 'text-secondary'}`, children: isOverBalance
                    ? `Exceeds available balance of ${available} ${currency}`
                    : `Available: ${available} ${currency}` })), error && (_jsx("p", { id: errorId, role: "alert", className: "text-xs text-error", children: error }))] }));
}
//# sourceMappingURL=index.js.map