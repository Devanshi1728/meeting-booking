import { ReactNode } from 'react'

type BadgeProps = {
  label: string
  variant?: 'success' | 'warning' | 'muted'
}

const styles = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  muted: 'bg-slate-100 text-slate-700',
}

export const Badge = ({ label, variant = 'muted' }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${styles[variant]}`}>
      {label}
    </span>
  )
}
