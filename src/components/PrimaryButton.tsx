import type { ComponentPropsWithoutRef } from 'react'

interface PrimaryButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant: 'solid' | 'outline'
  isLoading?: boolean
}

export function PrimaryButton({ variant, isLoading = false, disabled, children, className, ...props }: PrimaryButtonProps) {
  const buttonClassName = ['primary-button', `primary-button--${variant}`, className].filter(Boolean).join(' ')

  return (
    <button className={buttonClassName} disabled={isLoading || disabled} {...props}>
      {isLoading ? '처리 중...' : children}
    </button>
  )
}
