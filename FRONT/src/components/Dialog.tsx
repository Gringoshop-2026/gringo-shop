import { useEffect, useRef, type ReactNode } from 'react'

export default function Dialog({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const dialog = ref.current
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])
  return <dialog ref={ref} className="shop-dialog" aria-label={label} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }}>{children}</dialog>
}
