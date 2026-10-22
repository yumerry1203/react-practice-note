---
title: "비제어 컴포넌트와 React Hook Form"
description: "useRef 기반 비제어 컴포넌트와 React Hook Form을 비교하며 대규모 폼의 렌더링 비용 줄이기"
date: "2026-10-21"
tags:
  - useRef
  - React Hook Form
  - Uncontrolled Component
---

# 비제어 컴포넌트와 React Hook Form

필드가 많은 폼에서 제어 컴포넌트를 사용하면 입력값이 바뀔 때마다 React 상태가 갱신되고 리렌더링이 발생한다. 비제어 컴포넌트는 입력값을 DOM이 관리하도록 두어 타이핑 중 발생하는 렌더링 비용을 줄인다.

`useRef`로 비제어 컴포넌트를 직접 관리하는 방법과 React Hook Form(RHF)으로 이를 자동화하는 방법을 비교했다.

## 1. 비제어 컴포넌트란

비제어 컴포넌트는 `value`와 `onChange`로 입력값을 React 상태에 연결하지 않는다.(입력할때마다 리렌더링 발생 x) 대신 브라우저의 DOM 요소가 입력값을 보관하고, 제출처럼 필요한 시점에만 값을 가져온다.

```tsx
<input ref={nameRef} placeholder="이름" />
```

입력하는 동안 React 상태가 변경되지 않으므로 타이핑마다 리렌더링이 발생하지 않는다. 다만 React가 입력값을 즉시 알고 있지 않기 때문에 값이 필요한 순간 DOM에 직접 접근해야 한다.

## 2. useRef로 비제어 폼 만들기

`useRef`는 DOM 요소를 참조할 수 있게 해준다. 각 입력 필드에 ref를 연결하고, 제출 시점에 `current.value`로 값을 읽는다.

```tsx
import { useRef } from 'react'

export default function ManualRefForm() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const data = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    }

    console.log('수동 수집 데이터:', data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} placeholder="이름" />
      <input ref={emailRef} placeholder="이메일" />
      <button type="submit">제출</button>
    </form>
  )
}
```

`nameRef.current?.value`처럼 제출 시점에 DOM에서 값을 직접 꺼낸다. 입력 필드 수가 적을 때는 간단하지만, 필드가 많아질수록 ref와 값 수집 코드를 계속 추가해야 한다.

## 3. useRef 방식의 한계

`useRef` 방식은 타이핑 성능 측면에서는 유리하지만, 폼이 복잡해질수록 수동 관리 코드가 많아진다.

- 필드마다 ref를 별도로 만들어야 한다.
- 제출할 때마다 `current.value`로 값을 직접 수집해야 한다.
- 초기값, 실시간 검증, 오류 메시지를 직접 구현해야 한다.
- 필드 수가 많아질수록 폼 데이터 구조를 한눈에 파악하기 어려워진다.

즉, 비제어 방식의 성능 이점은 얻을 수 있지만 폼을 선언적으로 관리하기 어렵다는 한계가 있다.

## 4. React Hook Form의 등장

React Hook Form은 비제어 컴포넌트 전략을 사용하면서도, 필드 등록과 제출 처리를 선언적으로 작성할 수 있게 해준다.

```bash
npm install react-hook-form
```

핵심은 `useForm`이 반환하는 `register` 함수이다. `register`는 입력 요소를 RHF에 등록하고 ref와 이벤트 처리에 필요한 속성을 연결한다.

```tsx
<input {...register('firstName')} />
```

위 코드의 전개 연산자(`...`)는 `register`가 반환한 속성 묶음을 입력 요소에 전달한다.

```tsx
const { name, onChange, onBlur, ref } = register('firstName')

<input name={name} onChange={onChange} onBlur={onBlur} ref={ref} />
```

두 코드는 같은 방식으로 동작한다. RHF는 입력값을 React의 `useState`로 관리하지 않고, 필요한 시점에 데이터를 취합한다.

## 5. React Hook Form으로 폼 만들기

TypeScript 제네릭을 사용하면 등록할 필드 이름과 제출 데이터의 타입을 함께 관리할 수 있다.

```tsx
import { type SubmitHandler, useForm } from 'react-hook-form'

interface FormInputs {
  firstName: string
  email: string
  age: number
}

export default function SmartForm() {
  const { register, handleSubmit } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('최종 데이터:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="성함" />
      <input {...register('email')} placeholder="이메일" />
      <input type="number" {...register('age')} placeholder="나이" />
      <button type="submit">데이터 제출</button>
    </form>
  )
}
```

`useForm<FormInputs>()`는 폼 데이터의 구조를 정의한다. `handleSubmit(onSubmit)`은 브라우저의 기본 제출 동작을 막고, 제출 시점에 취합한 데이터를 `onSubmit`에 전달한다.

## 6. 핵심 메서드

| 항목 | 역할 | 동작 |
| --- | --- | --- |
| `useForm<T>()` | 폼 관리 도구 초기화 | `register`, `handleSubmit` 등 폼 관리에 필요한 기능을 반환한다. |
| `register(name)` | 입력 필드 등록 | 입력 요소를 비제어 방식으로 연결하고 필요한 속성을 제공한다. |
| `handleSubmit(fn)` | 제출 처리 | 기본 제출 동작을 막고, 유효성 검사를 통과한 데이터를 함수에 전달한다. |
| `SubmitHandler<T>` | 제출 함수 타입 지정 | `onSubmit`의 데이터 타입을 `T`에 맞게 추론한다. |
| `...register(name)` | 속성 전개 | `name`, `ref`, `onChange`, `onBlur` 등을 입력 요소에 전달한다. |

## 7. useRef 방식과 React Hook Form 비교

| 구분 | useRef 기반 비제어 방식 | React Hook Form |
| --- | --- | --- |
| 입력값 보관 | DOM 요소가 보관한다. | DOM 기반 비제어 방식으로 값을 관리한다. |
| 필드 연결 | 필드마다 ref를 직접 생성한다. | `register`로 필드를 등록한다. |
| 제출 데이터 수집 | `current.value`로 직접 값을 읽는다. | `handleSubmit`이 데이터를 취합해 전달한다. |
| 필드 증가 | ref와 수집 코드가 함께 늘어난다. | `register` 호출을 추가해 관리한다. |
| 타입 관리 | 데이터 객체를 직접 구성해야 한다. | `useForm<T>()`, `SubmitHandler<T>`로 타입을 연결한다. |
| 렌더링 비용 | 타이핑 중 리렌더링이 발생하지 않는다. | 비제어 전략을 사용해 타이핑 중 렌더링을 줄인다. |

## 정리

- 비제어 컴포넌트는 입력값을 DOM이 관리하게 하여 타이핑 중 리렌더링을 줄인다.
- `useRef`는 비제어 방식을 구현하는 기본 도구이지만, 필드가 많아지면 수동 관리 코드가 늘어난다.
- React Hook Form은 비제어 전략을 유지하면서 `register`와 `handleSubmit`으로 폼 관리 과정을 단순화한다.
- `useForm<T>()`과 `SubmitHandler<T>`를 사용하면 필드 이름과 제출 데이터의 타입을 함께 관리할 수 있다.
