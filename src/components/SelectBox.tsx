import type { ComponentPropsWithoutRef } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface SelectBoxProps extends ComponentPropsWithoutRef<'select'> {
  label: string
  options: SelectOption[]
}

export function SelectBox({ id, label, options, ...props }: SelectBoxProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} {...props}>
        <option value="">실습을 선택해 주세요</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
