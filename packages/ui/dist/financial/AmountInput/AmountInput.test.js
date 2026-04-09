import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AmountInput } from './index';
const setup = (props = {}) => {
    const onChange = vi.fn();
    const result = render(_jsx(AmountInput, { currency: "GBP", value: "", onChange: onChange, available: "1000.00", ...props }));
    return { ...result, onChange };
};
describe('AmountInput', () => {
    it('renders label', () => {
        setup();
        expect(screen.getByLabelText(/amount/i)).toBeTruthy();
    });
    it('renders currency symbol', () => {
        setup();
        expect(screen.getByText('GBP')).toBeTruthy();
    });
    it('shows available balance hint', () => {
        setup();
        expect(screen.getByText(/Available: 1000.00 GBP/i)).toBeTruthy();
    });
    it('calls onChange with valid decimal input', async () => {
        const user = userEvent.setup();
        const { onChange } = setup();
        const input = screen.getByRole('textbox');
        await user.type(input, '500.00');
        expect(onChange).toHaveBeenCalled();
    });
    it('does not call onChange for invalid input (letters)', async () => {
        const user = userEvent.setup();
        const { onChange } = setup();
        const input = screen.getByRole('textbox');
        await user.type(input, 'abc');
        expect(onChange).not.toHaveBeenCalled();
    });
    it('shows over-balance warning when amount exceeds available', async () => {
        const user = userEvent.setup();
        setup({ available: '100.00' });
        const input = screen.getByRole('textbox');
        await user.type(input, '200');
        expect(screen.getByText(/Exceeds available balance/i)).toBeTruthy();
    });
    it('marks input as aria-invalid when error prop set', () => {
        setup({ error: 'Amount is required' });
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('aria-invalid')).toBe('true');
    });
    it('shows error message', () => {
        setup({ error: 'Amount is required' });
        expect(screen.getByRole('alert')).toBeTruthy();
        expect(screen.getByText('Amount is required')).toBeTruthy();
    });
    it('is disabled when disabled prop set', () => {
        setup({ disabled: true });
        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });
    it('accepts integer input', async () => {
        const user = userEvent.setup();
        const { onChange } = setup();
        await user.type(screen.getByRole('textbox'), '500');
        expect(onChange).toHaveBeenCalledWith('500');
    });
    it('accepts decimal with one place', async () => {
        const user = userEvent.setup();
        const { onChange } = setup();
        await user.type(screen.getByRole('textbox'), '9.5');
        expect(onChange).toHaveBeenCalledWith('9.5');
    });
    it('rejects more than 2 decimal places', async () => {
        const user = userEvent.setup();
        const { onChange } = setup();
        const input = screen.getByRole('textbox');
        // type 9.999 — should stop at 9.99
        await user.type(input, '9.99');
        expect(onChange).toHaveBeenLastCalledWith('9.99');
        // further digit should be blocked
        const callsBefore = onChange.mock.calls.length;
        await user.type(input, '9');
        expect(onChange.mock.calls.length).toBe(callsBefore);
    });
    it('renders custom label', () => {
        setup({ label: 'Send amount' });
        expect(screen.getByLabelText(/send amount/i)).toBeTruthy();
    });
    it('uses EUR currency', () => {
        setup({ currency: 'EUR' });
        expect(screen.getByText('EUR')).toBeTruthy();
    });
    it('input has inputMode decimal for mobile keyboard', () => {
        setup();
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('inputmode')).toBe('decimal');
    });
    it('placeholder is 0.00', () => {
        setup();
        const input = screen.getByRole('textbox');
        expect(input.getAttribute('placeholder')).toBe('0.00');
    });
});
//# sourceMappingURL=AmountInput.test.js.map