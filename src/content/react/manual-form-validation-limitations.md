---
title: "useEffect로 수동 form 검증하기의 한계"
description: "useState와 useEffect로 이메일을 검증하는 흐름에서 상태 시차와 연쇄 리렌더링이 발생하는 이유를 살펴본다."
date: "2026-10-22"
tags:
  - useState
  - useEffect
  - Form Validation
---

# useEffect로 수동 폼 검증하기의 한계

가장 직관적인 폼 검증 방식은 입력값이 바뀔 때마다 값을 확인하고 에러 상태를 갱신하는 방식이다. 이 과정에서는 `useState`로 에러 상태를 만들고, `useEffect`에서 정규표현식으로 입력값을 검사한다.

작은 폼에서는 쉽게 적용할 수 있지만, 필드 수가 많아지고 필드 간 검증 조건이 생기면 상태와 렌더링 비용을 관리하기 어려워진다.  
하나의 입력 필드에서 2개의 상태관리가 필요해지고 대규모 프로젝트에서는 이런 구조가 늘어날 수록 관리하기 힘들다

## 1. 정규표현식으로 이메일 형식 검사하기

정규표현식(Regex)은 문자열이 특정 패턴과 일치하는지 검사하는 도구이다. 이메일 형식 검증에도 사용할 수 있지만, 코드 안에 직접 작성하면 어떤 규칙을 확인하는지 한눈에 파악하기 어렵다.

```ts
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

이 정규표현식은 이메일에서 `@` 앞뒤의 문자열과 도메인 확장자 형식을 확인한다.

## 2. useEffect로 수동 검증하기

입력 데이터와 에러 메시지를 각각 상태로 만들고, `email` 값이 바뀔 때마다 `useEffect`가 실행되도록 구성할 수 있다.

```tsx
import { useEffect, useState } from 'react'

export default function MessyValidationForm() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (email.length > 0 && !emailRegex.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.')
      return
    }

    setEmailError('')
  }, [email])

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd' }}>
      <h3>수동 검증 시스템</h3>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="이메일을 입력하세요"
      />
      {emailError && <p style={{ color: 'red', fontSize: '12px' }}>{emailError}</p>}
    </div>
  )
}
```

입력값은 `email` 상태에 저장하고, 검증 결과는 `emailError` 상태에 따로 저장한다. 에러 메시지는 값이 있을 때만 조건부 렌더링으로 표시한다.

## 3. 데이터 상태와 에러 상태의 이원화

이 방식은 한 필드에 데이터 상태와 에러 상태를 각각 만들어야 한다.

```tsx
const [email, setEmail] = useState('')
const [emailError, setEmailError] = useState('')
```

필드가 100개라면 입력값과 에러 메시지를 관리하는 상태도 크게 늘어난다. 각 상태에 맞는 `onChange`, 검증 조건, 에러 UI까지 추가해야 하므로 폼의 규모가 커질수록 코드가 복잡해진다.

## 4. useEffect 기반 검증 흐름

수동 검증은 다음 순서로 동작한다.

```text
사용자 입력
        ↓
email 상태 변경
        ↓
첫 번째 리렌더링
        ↓
useEffect 실행
        ↓
emailError 상태 변경
        ↓
두 번째 리렌더링
```

`useEffect`는 화면이 그려진 뒤 실행된다. 따라서 입력값이 바뀐 직후에는 이전 에러 상태가 잠시 화면에 남아 있을 수 있고, 그다음 검증 결과가 반영되며 다시 렌더링된다.

## 5. 상태 시차

`useEffect`를 사용하면 입력 상태와 검증 상태가 같은 렌더링에서 동시에 갱신되지 않는다. 입력값이 먼저 화면에 반영되고, 이후 Effect가 실행되어 에러 상태를 업데이트한다.

이런 시차는 짧게 느껴질 수 있지만, 실시간 검증이 많은 폼에서는 에러 메시지가 늦게 나타나거나 사라지는 것처럼 보일 수 있다.

## 6. 의존성 배열이 복잡해지는 경우

비밀번호와 비밀번호 확인처럼 여러 필드가 서로를 참조하는 검증은 의존성 배열을 복잡하게 만든다.

```tsx
useEffect(() => {
  if (password !== passwordConfirm) {
    setPasswordConfirmError('비밀번호가 일치하지 않습니다.')
  }
}, [password, passwordConfirm])
```

필드 간 관계가 많아질수록 어떤 값의 변경이 어떤 검증을 실행하는지 추적하기 어려워진다. 의존성 배열에서 필요한 값을 빠뜨리면 검증이 갱신되지 않는 문제도 생길 수 있다.

## 7. 수동 검증 방식의 한계

| 구분 | 문제 |
| --- | --- |
| 상태 수 | 필드마다 입력값과 에러 상태를 별도로 관리한다. |
| 검증 로직 | 조건문과 정규표현식을 필드마다 직접 작성한다. |
| 렌더링 | 입력값과 에러 상태 갱신으로 연속 렌더링이 발생할 수 있다. |
| 필드 간 검증 | 여러 `useEffect`와 의존성 배열이 얽힐 수 있다. |
| 에러 UI | 에러 메시지의 표시 조건을 직접 작성해야 한다. |

## 정리

- `useState`와 `useEffect`만으로도 실시간 폼 검증을 구현할 수 있다.
- 입력값과 에러 상태를 분리하면 필드가 많아질수록 관리해야 할 코드가 늘어난다.
- `useEffect`는 렌더링 이후 실행되므로 입력 상태와 검증 상태 사이에 시차가 생길 수 있다.
- 여러 필드를 함께 검증할수록 의존성 배열과 검증 흐름이 복잡해진다.
- 대규모 폼에서는 수동 검증의 한계를 줄이기 위해 폼 관리 도구를 고려할 수 있다.
