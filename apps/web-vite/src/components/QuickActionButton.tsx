import React from 'react'

interface QuickAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}

interface Props {
  actions: QuickAction[]
}

export function QuickActionButton({ actions }: Props): React.ReactElement {
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          disabled={action.disabled}
          className="flex flex-col items-center gap-2 p-4 rounded-xl banxe-card hover:bg-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={action.label}
        >
          <span className="text-blue-400" aria-hidden="true">
            {action.icon}
          </span>
          <span className="text-xs font-medium text-slate-300">{action.label}</span>
        </button>
      ))}
    </div>
  )
}
