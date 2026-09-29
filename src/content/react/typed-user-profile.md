---
title: "Props와 타입으로 프로필 카드 만들기"
description: "User 인터페이스로 Props의 형태를 지정하고 사용자 정보를 프로필 카드에 출력하는 방법을 정리한다."
date: "2026-09-01"
tags:
  - React
  - TypeScript
  - Props
  - Interface
---

# Props와 타입으로 프로필 카드 만들기

사용자 데이터의 형태를 인터페이스로 정의하고 `Props`를 통해 프로필 카드 컴포넌트에 전달했다.

## 1. 사용자 데이터와 Props 정의하기

```tsx
export interface User {
  id: number
  displayName: string
}

interface UserProfileProps {
  user: User
}
```

`UserProfile`이 받을 `user`는 반드시 `id`와 `displayName`을 가진다.

## 2. 사용자 정보 출력하기

```tsx
export function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <h3>엔지니어 프로필</h3>
      <p>성함: <strong>{user.displayName.toUpperCase()}</strong></p>
      <code>ID Tag: {user.id}</code>
    </div>
  )
}
```

구조 분해로 `user`를 받고 이름과 ID를 카드에 출력한다. `displayName`은 문자열로 보장되므로 `toUpperCase()`를 사용할 수 있다.

## 정리

- 인터페이스로 사용자 데이터의 형태를 정의한다.
- Props 인터페이스로 컴포넌트가 받을 값을 제한한다.
- 타입이 보장된 값을 JSX에서 안전하게 사용한다.
