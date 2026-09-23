import type { ComponentPropsWithoutRef } from 'react'

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string
}

export function Input({ id, label, ...props }: InputProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...props} />
    </label>
  )
}
