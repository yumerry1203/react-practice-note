import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}

export function Modal({ isOpen, title, children, footer, onClose }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <section aria-labelledby="modal-title" aria-modal="true" className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <Button aria-label="모달 닫기" className="modal-close-button" onClick={onClose} variant="plain">×</Button>
        </header>
        <div className="modal-content">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </section>
    </div>
  )
}
