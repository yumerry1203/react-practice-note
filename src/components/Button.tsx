import type { ComponentPropsWithoutRef } from 'react'

type ButtonVariant = 'default' | 'outline' | 'plain'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant
}

export function Button({ variant = 'default', className, ...props }: ButtonProps) {
  const buttonClassName = ['app-button', `app-button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return <button className={buttonClassName} type="button" {...props} />
}
