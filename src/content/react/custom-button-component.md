---
title: "ComponentPropsWithRef로 커스텀 버튼 만들기"
description: "기본 button 속성을 이어받고 색상과 외부 스타일을 조합하는 재사용 가능한 버튼을 정리한다."
date: "2026-09-01"
tags:
  - React
  - TypeScript
  - ComponentPropsWithRef
  - Button
---

# ComponentPropsWithRef로 커스텀 버튼 만들기

기본 HTML 버튼의 속성을 유지하면서 프로젝트에서 사용할 색상과 스타일을 추가한 `CustomButton`을 만들었다.

## 1. 기본 버튼 속성 이어받기

```tsx
interface CustomButtonProps
  extends Omit<ComponentPropsWithRef<'button'>, 'color'> {
  CustomColor: 'primary' | 'secondary'
  children: React.ReactNode
}
```

`ComponentPropsWithRef<'button'>`를 사용하면 `onClick`, `disabled`, `type` 같은 기본 버튼 속성을 다시 선언하지 않고 사용할 수 있다. 기존 `color` 속성은 제외하고 `CustomColor`를 별도로 정의했다.

## 2. 색상과 외부 스타일 합성하기

```tsx
export function CustomButton({
  children,
  CustomColor,
  style,
  ...rest
}: CustomButtonProps) {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: CustomColor === 'primary' ? '#646cff' : '#2f3640',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    ...style,
  }

  return <button style={buttonStyle} {...rest}>{children}</button>
}
```

`...style`을 기본 스타일 뒤에 배치해 외부에서 전달한 스타일을 합성한다. `...rest`로 나머지 표준 버튼 속성도 실제 요소에 전달한다.

## 정리

- `ComponentPropsWithRef<'button'>`로 기본 버튼 속성을 재사용한다.
- `Omit`으로 충돌할 수 있는 속성을 제외한다.
- 구조 분해한 `style`과 나머지 속성을 실제 버튼에 전달한다.
