import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BalanceWidget } from './index';
const defaultProps = {
    currency: 'GBP',
    total: '4750.00',
    available: '4700.00',
    pending: '50.00',
};
describe('BalanceWidget', () => {
    it('renders total amount', () => {
        render(_jsx(BalanceWidget, { ...defaultProps }));
        expect(screen.getByText('4750.00')).toBeTruthy();
    });
    it('renders currency label', () => {
        render(_jsx(BalanceWidget, { ...defaultProps }));
        expect(screen.getByText(/GBP Balance/i)).toBeTruthy();
    });
    it('renders available and pending breakdown', () => {
        render(_jsx(BalanceWidget, { ...defaultProps }));
        expect(screen.getByText('4700.00')).toBeTruthy();
        expect(screen.getByText('50.00')).toBeTruthy();
    });
    it('shows skeleton when loading', () => {
        render(_jsx(BalanceWidget, { ...defaultProps, loading: true }));
        expect(screen.getByLabelText('Loading balance')).toBeTruthy();
        expect(screen.queryByText('4750.00')).toBeNull();
    });
    it('shows error state when error prop set', () => {
        render(_jsx(BalanceWidget, { ...defaultProps, error: true }));
        expect(screen.getByRole('alert')).toBeTruthy();
        expect(screen.getByText(/Balance unavailable/i)).toBeTruthy();
    });
    it('masks amount when privacy mode toggled', async () => {
        const user = userEvent.setup();
        render(_jsx(BalanceWidget, { ...defaultProps }));
        const hideButton = screen.getByRole('button', { name: /hide balance/i });
        await user.click(hideButton);
        expect(screen.getAllByText('••••').length).toBeGreaterThan(0);
    });
    it('reveals amount when privacy mode toggled off', async () => {
        const user = userEvent.setup();
        render(_jsx(BalanceWidget, { ...defaultProps }));
        await user.click(screen.getByRole('button', { name: /hide balance/i }));
        await user.click(screen.getByRole('button', { name: /show balance/i }));
        expect(screen.getByText('4750.00')).toBeTruthy();
    });
    it('has accessible aria-label on total amount', () => {
        render(_jsx(BalanceWidget, { ...defaultProps }));
        expect(screen.getByLabelText(/4750.00 GBP total balance/i)).toBeTruthy();
    });
    it('has accessible aria-label on available amount', () => {
        render(_jsx(BalanceWidget, { ...defaultProps }));
        expect(screen.getByLabelText(/4700.00 GBP available/i)).toBeTruthy();
    });
    it('has accessible aria-label on pending amount', () => {
        render(_jsx(BalanceWidget, { ...defaultProps }));
        expect(screen.getByLabelText(/50.00 GBP pending/i)).toBeTruthy();
    });
    it('privacy button has aria-pressed false by default', () => {
        render(_jsx(BalanceWidget, { ...defaultProps }));
        const btn = screen.getByRole('button', { name: /hide balance/i });
        expect(btn.getAttribute('aria-pressed')).toBe('false');
    });
    it('privacy button aria-pressed true when active', async () => {
        const user = userEvent.setup();
        render(_jsx(BalanceWidget, { ...defaultProps }));
        await user.click(screen.getByRole('button', { name: /hide balance/i }));
        const btn = screen.getByRole('button', { name: /show balance/i });
        expect(btn.getAttribute('aria-pressed')).toBe('true');
    });
    it('renders retry button in error state', () => {
        render(_jsx(BalanceWidget, { ...defaultProps, error: true }));
        expect(screen.getByRole('button', { name: /retry/i })).toBeTruthy();
    });
    it('does not render loading when only error is true', () => {
        render(_jsx(BalanceWidget, { ...defaultProps, error: true }));
        expect(screen.queryByLabelText('Loading balance')).toBeNull();
    });
    it('renders GBP currency correctly', () => {
        render(_jsx(BalanceWidget, { ...defaultProps, currency: "GBP" }));
        expect(screen.getByText(/GBP Balance/i)).toBeTruthy();
    });
    it('renders EUR currency correctly', () => {
        render(_jsx(BalanceWidget, { ...defaultProps, currency: "EUR", total: "2100.00", available: "2100.00", pending: "0.00" }));
        expect(screen.getByText(/EUR Balance/i)).toBeTruthy();
    });
});
//# sourceMappingURL=BalanceWidget.test.js.map