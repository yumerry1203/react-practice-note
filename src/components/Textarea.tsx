import type { ComponentPropsWithoutRef } from 'react'

interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string
}

export function Textarea({ id, label, ...props }: TextareaProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} {...props} />
    </label>
  )
}
