import { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
}

export const Input = ({ label, hint, className = '', ...props }: InputProps) => {
  return (
    <label className="block text-sm text-slate-900">
      <span className="font-semibold">{label}</span>
      <input
        className={`mt-2 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 ${className}`}
        {...props}
      />
      {hint ? <span className="mt-2 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}
