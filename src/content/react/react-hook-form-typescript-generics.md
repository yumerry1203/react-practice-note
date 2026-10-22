---
title: "useForm과 TypeScript 제네릭으로 타입 안전한 Form 만들기"
description: "React Hook Form의 useForm 제네릭, register, SubmitHandler를 사용해 폼 데이터와 중첩 필드의 타입을 관리하는 방법을 정리한다."
date: "2026-10-22"
tags:
  - React Hook Form
  - useFrom
  - SubmitHandler
---

# useForm과 TypeScript 제네릭으로 타입 안전한 Form 만들기

React Hook Form(RHF)의 비제어 방식으로 렌더링 비용을 줄였다면, 다음으로 폼 데이터의 타입을 명확하게 관리할 필요가 있다. `useForm<T>()`에 제네릭을 전달하면 등록할 필드 이름과 제출 데이터의 구조를 하나의 타입으로 연결할 수 있다.

## 1. useForm<T>가 하는 일

`useForm`은 폼의 등록, 제출, 유효성 상태를 관리하는 도구이다. 제네릭 `T`에는 폼 데이터의 설계도를 전달한다.

```tsx
const form = useForm<UserProfileForm>()
```

`UserProfileForm`을 전달하면 `register`, `watch`, `handleSubmit`처럼 `useForm`이 반환하는 기능이 해당 타입의 필드 구조를 기준으로 동작한다. 존재하지 않는 필드 이름을 등록하려 하면 TypeScript가 오류를 표시한다.

## 2. 폼 데이터 타입 정의하기

폼 데이터는 중첩된 객체까지 포함해 인터페이스로 정의할 수 있다.

```ts
export interface UserProfileForm {
  userName: string
  userEmail: string
  userAge: number
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}
```

`theme`처럼 선택 가능한 값이 정해진 필드는 `string` 대신 `'light' | 'dark'` 유니온 타입으로 작성한다. 이 방식은 허용하지 않는 값을 입력하거나 잘못된 값을 사용하는 실수를 줄인다.

## 3. register로 타입이 연결된 필드 등록하기

`register`는 입력 요소를 RHF에 연결한다. `useForm<UserProfileForm>()`을 사용하면 `register`의 필드 이름도 `UserProfileForm`에 정의된 경로만 사용할 수 있다.

```tsx
<input {...register('userName')} />
<input {...register('userEmail')} />
<select {...register('preferences.theme')}>
  <option value="light">라이트 모드</option>
  <option value="dark">다크 모드</option>
</select>
```

`preferences.theme`처럼 점 표기법을 사용하면 중첩된 객체의 필드까지 등록할 수 있다. TypeScript는 이 경로를 따라가며 `theme`에 허용되는 값도 추적한다.

`register`가 반환하는 `name`, `ref`, `onChange`, `onBlur` 등의 속성은 전개 연산자(`...`)를 통해 입력 요소에 전달된다.

```tsx
<input {...register('userName')} />
```

## 4. 숫자 입력값 처리하기

`input`의 값은 기본적으로 문자열로 전달된다. 폼 데이터에서 나이를 `number`로 관리하려면 `valueAsNumber` 옵션을 추가한다.

```tsx
<input
  type="number"
  {...register('userAge', { valueAsNumber: true })}
  placeholder="나이"
/>
```

이 옵션을 사용하면 제출 데이터의 `userAge`를 숫자로 처리할 수 있다.

## 5. SubmitHandler로 제출 데이터 타입 지정하기

`SubmitHandler<T>`는 제출 함수의 데이터 타입을 `T`와 연결한다.

```tsx
const onSave: SubmitHandler<UserProfileForm> = (data) => {
  console.log(data.userName)
  console.log(data.preferences.theme)
}
```

`data`는 `UserProfileForm` 타입으로 추론된다. 따라서 별도의 타입 단언 없이 이름, 이메일, 나이, 환경 설정에 타입 안전하게 접근할 수 있다.

## 6. 전체 폼 예제

```tsx
import { type SubmitHandler, useForm } from 'react-hook-form'

interface UserProfileForm {
  userName: string
  userEmail: string
  userAge: number
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

export default function TypedForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({
    defaultValues: {
      userName: '',
      userEmail: '',
      userAge: 20,
      preferences: {
        theme: 'light',
        notifications: true,
      },
    },
    mode: 'onChange',
  })

  const onSave: SubmitHandler<UserProfileForm> = (data) => {
    console.log('검증 완료된 데이터:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <input {...register('userName', { required: '이름을 입력한다.' })} placeholder="성함" />
      {errors.userName && <p>{errors.userName.message}</p>}

      <input {...register('userEmail')} placeholder="이메일 주소" />
      <input
        type="number"
        {...register('userAge', { valueAsNumber: true })}
        placeholder="나이"
      />

      <fieldset>
        <legend>환경 설정</legend>
        <select {...register('preferences.theme')}>
          <option value="light">라이트 모드</option>
          <option value="dark">다크 모드</option>
        </select>

        <label>
          <input type="checkbox" {...register('preferences.notifications')} />
          알림 수신 동의
        </label>
      </fieldset>

      <button type="submit">안전하게 저장하기</button>
    </form>
  )
}
```

`defaultValues`는 폼의 초기 데이터 구조를 설정한다. `mode: 'onChange'`는 입력값이 바뀌는 시점에 등록된 검증 규칙을 확인하도록 설정한다. `handleSubmit(onSave)`는 기본 제출 동작을 막고, 모든 검증을 통과했을 때만 `onSave`를 실행한다.

## 7. 핵심 흐름

```text
UserProfileForm 타입 정의
        ↓
useForm<UserProfileForm>()으로 폼 생성
        ↓
register('필드 경로')로 입력 요소 연결
        ↓
handleSubmit(onSave)로 제출 처리
        ↓
SubmitHandler<UserProfileForm> 타입의 데이터 수신
```

## 정리

- `useForm<T>()`의 제네릭은 폼 데이터의 구조와 필드 이름을 연결한다.
- `register`는 타입에 정의된 필드와 중첩 경로를 안전하게 등록한다.
- `SubmitHandler<T>`는 제출 함수가 받는 데이터의 타입을 자동으로 추론한다.
- 숫자 입력값은 `valueAsNumber: true`를 사용해 `number` 타입으로 처리한다.
- 유니온 타입과 중첩 객체를 함께 사용하면 실무 폼의 데이터 규격을 더 명확하게 관리할 수 있다.
