---
title: "Type Guard로 사용자 입력 검증하기"
description: "unknown 데이터에 타입 가드를 적용하고 useId와 useRef로 입력값을 검증하는 방법"
date: "2026-09-29"
tags:
  - Type Guard
  - useRef
  - useId
---

# Type Guard로 사용자 입력 검증하기

외부에서 들어오거나 사용자가 입력한 데이터는 바로 신뢰할 수 없기 때문에 `unknown`으로 받은 값을 타입 가드로 검증한 뒤 안전하게 사용하는게 목표

## 1. `is` 키워드

타입 가드는 알 수 없는 데이터가 특정 타입의 조건을 만족하는지 확인하는 함수이다. 반환 타입에 `data is 타입`을 작성하면 조건문 안에서 타입이 좁혀진다.

```ts
function isString(data: unknown): data is string {
  return typeof data === 'string'
}

const value: unknown = 'Hello'

if (isString(value)) {
  console.log(value.toUpperCase())
}
```

`isString(value)`가 `true`이면 `value`는 이 블록 안에서 `string`으로 처리된다.

## 2. 타입 가드 만들기

```ts
export interface UserProfile {
  id: string
  nickname: string
}

export function isUserProfile(data: unknown): data is UserProfile {
  return (
    data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    'nickname' in data &&
    typeof data.id === 'string' &&
    typeof data.nickname === 'string' &&
    data.nickname.length >= 2
  )
}
```

가드 함수는 객체인지 확인하고 `id`, `nickname`의 타입과 닉네임 길이를 검사한다. 검증에 **성공한 경우에만** `UserProfile`의 속성에 접근할 수 있다.

## 3. `useId`와 `useRef`로 입력값 검증하기

```tsx
const generatedId = useId()
const inputRef = useRef<HTMLInputElement>(null)
const [status, setStatus] = useState('대기 중')

const handleVerify = () => {
  const rawData: unknown = {
    id: 'manual-id-123',
    nickname: inputRef.current?.value || '',
  }

  if (isUserProfile(rawData)) {
    setStatus(`승인됨: ${rawData.nickname}`)
    inputRef.current?.focus()
  } else {
    setStatus('차단됨: 닉네임은 2자 이상이어야 한다.')
    inputRef.current?.focus()
  }
}
```

`useId`는 label과 input을 연결할 ID를 만든다. `useRef`는 입력 요소에 접근할 때 사용한다. `?.`로 요소가 존재하는 경우에만 값을 읽거나 포커스를 이동


## 주의할 점

- 외부 데이터는 검증 전까지 `unknown`으로 다룬다.
- 타입 가드 조건에는 필요한 속성, 속성 타입, 추가 규칙을 함께 작성한다.
- `ref.current`는 없을 수 있으므로 optional chaining이나 존재 여부 확인 뒤에 사용한다.

## 정리

- 타입 가드는 `unknown` 데이터를 검증하고 안전한 타입으로 좁힌다.
- `data is UserProfile` 형태의 타입 서술어로 검증 결과를 TypeScript에 전달한다.
- `useRef`로 입력 요소에 접근할 때는 `current`의 존재 여부를 확인한다.
- `React.ReactNode`는 다양한 React 렌더링 값을 받을 때 사용한다.
