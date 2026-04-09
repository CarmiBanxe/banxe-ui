import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

/**
 * AppLayout — authenticated app shell
 *
 * Sidebar: 240px fixed | collapsible to 64px (icon-only)
 * Active item: left border accent (brand-primary), bg-overlay
 * Footer: user info + sign-out stub
 */

interface NavItem {
  href: string
  label: string
  icon: string
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/',             label: 'Dashboard',     icon: '⌂',  exact: true },
  { href: '/wallets',      label: 'Wallets',        icon: '◈' },
  { href: '/transactions', label: 'Transactions',   icon: '≡' },
  { href: '/send',         label: 'Send Money',     icon: '↑' },
  { href: '/ai',           label: 'AI Assistant',   icon: '✦' },
  { href: '/settings',     label: 'Settings',       icon: '⚙' },
]

function SidebarItem({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  return (
    <NavLink
      to={item.href}
      end={item.exact}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group',
          'text-sm font-medium',
          isActive
            ? 'bg-overlay text-primary before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-brand-primary before:rounded-r'
            : 'text-secondary hover:bg-overlay hover:text-primary',
        ].join(' ')
      }
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
    >
      <span className="text-xl flex-shrink-0 w-6 text-center" aria-hidden="true">
        {item.icon}
      </span>
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {/* Tooltip on hover when collapsed */}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-elevated border border-border-subtle text-primary text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
          {item.label}
        </span>
      )}
    </NavLink>
  )
}

export function AppLayout(): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  // AI Assistant is full-height (no padding)
  const isAI = location.pathname === '/ai'

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col flex-shrink-0 border-r border-border-subtle bg-bg-surface transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border-subtle flex-shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'var(--color-primary, #1A7FD4)' }}
            aria-hidden="true"
          >
            B
          </div>
          {!collapsed && (
            <span className="font-bold text-primary text-base truncate">BANXE</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5" role="navigation">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border-subtle p-2 flex-shrink-0">
          <div className={`flex items-center gap-2 p-2 rounded-lg hover:bg-overlay cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-brand-subtle flex items-center justify-center text-xs font-bold text-brand-primary flex-shrink-0">
              MC
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-primary truncate">Moriel Carmi</p>
                <p className="text-xs text-secondary truncate">Individual</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center justify-center h-10 border-t border-border-subtle text-secondary hover:text-primary hover:bg-overlay transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <span aria-hidden="true" className="text-sm">
            {collapsed ? '→' : '←'}
          </span>
        </button>
      </aside>

      {/* ── Main content ── */}
      <main
        className={`flex-1 overflow-y-auto min-w-0 ${isAI ? '' : ''}`}
        role="main"
        id="main-content"
      >
        <Outlet />
      </main>
    </div>
  )
}
