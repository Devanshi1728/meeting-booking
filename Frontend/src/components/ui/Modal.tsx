import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ModalProps = {
  title?: string
  children: ReactNode
  onClose: () => void
}

export const Modal = ({ title, children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      <div className="relative z-10 pointer-events-auto max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : <div />}
          <button onClick={onClose} className="text-sm text-slate-600 hover:text-slate-900">
            <X />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
