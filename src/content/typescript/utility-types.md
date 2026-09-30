---
title: "인터페이스 확장과 유틸리티 타입"
description: "표준 HTML 속성을 재사용하고 Omit과 Partial로 기존 타입을 용도에 맞게 가공하기"
date: "2026-09-23"
tags:
  - ComponentPropsWithoutRef
  - Omit
  - Partial
---

# 인터페이스 확장과 유틸리티 타입

표준 버튼 속성을 안전하게 이어받고, 기존 데이터 타입에서 필요한 속성을 제외하거나 선택 사항으로 바꾸는 방법

## 1. 표준 버튼 속성 확장하기

```tsx
interface PrimaryButtonProps
  extends ComponentPropsWithoutRef<'button'> {
  variant: 'solid' | 'outline'
  isLoading?: boolean
}
```

`ComponentPropsWithoutRef<'button'>`로 버튼의 표준 속성을 재사용하고 프로젝트에 필요한 `variant`와 `isLoading`을 추가

## 2. Omit으로 속성 제외하기

```ts
interface Product {
  id: string
  name: string
  price: number
  adminNote: string
  secretToken: string
}

type UserViewProduct = Omit<Product, 'adminNote' | 'secretToken'>
```

사용자 화면에 필요하지 않은 관리자 메모와 인증 토큰을 타입에서 제외한다.

## 3. Partial로 부분 수정하기

```tsx
const handleUpdate = (changes: Partial<UserProfile>) => {
  setProfile((previousProfile) => ({
    ...previousProfile,
    ...changes,
  }))
}
```

`Partial<UserProfile>`은 모든 속성을 선택 사항으로 바꾼다. 전체 프로필을 전달하지 않고 변경할 값만 전달할 수 있다.

## 정리

- `ComponentPropsWithoutRef`로 HTML 요소의 표준 속성을 재사용한다.
- `Omit`으로 기존 타입에서 불필요한 속성을 제외한다.
- `Partial`로 일부 속성만 받는 수정 타입을 만든다.
