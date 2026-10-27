---
title: "선언적 검증으로 구현하는 React Hook Form 에러 처리"
description: "React Hook Form의 검증 규칙과 errors 객체를 사용해 조건문과 useEffect를 줄이는 폼 처리 방식"
date: "2026-10-27"
tags:
  - React
  - React Hook Form
  - Form Validation
  - Error Handling
  - Proxy
---

# 선언적 검증으로 구현하는 React Hook Form 에러 처리

수동 폼 검증은 입력값과 에러 상태를 각각 관리하고, `useEffect`에서 조건문과 정규표현식을 실행해야 한다. React Hook Form(RHF)은 입력 필드에 필요한 규칙을 선언하고, 검증 결과를 `errors` 객체로 받아 에러 UI를 구성하는 방식을 제공한다.

이 방식에서는 "값이 바뀌면 검사하고 에러 상태를 변경한다"는 절차를 직접 작성하는 대신, "이 필드는 필수이고 특정 형식을 따라야 한다"는 규칙을 필드에 선언한다.

## 1. 선언적 검증이란

선언적 검증은 검증 결과를 만들기 위한 세부 절차보다 필드가 만족해야 하는 규칙 자체를 작성하는 방식이다.

```tsx
register('email', {
  required: '이메일은 필수 입력 항목입니다.',
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '올바른 이메일 형식이 아닙니다.',
  },
})
```

RHF는 `required`, `pattern`처럼 등록된 규칙을 기준으로 값을 검증하고, 규칙에 맞지 않으면 해당 필드의 오류 정보를 `errors` 객체에 넣는다. 별도의 `emailError` 상태나 `useEffect`를 만들 필요가 없다.

## 2. 검증 모드 설정하기

`useForm`의 `mode` 옵션은 검증을 실행하는 시점을 결정한다.

```tsx
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm<FormInputs>({
  mode: 'onChange',
})
```

`onChange` 모드는 사용자가 입력할 때마다 검증 결과를 갱신한다. `onSubmit`은 폼을 제출할 때 검증하고, `onTouched`는 사용자가 필드에 접근한 뒤 값을 변경할 때 검증한다.

`errors`는 규칙을 위반한 필드를 키로 사용해 오류 정보를 담는다. 오류가 없는 필드는 `errors`에 포함되지 않는다.

```tsx
{errors.email && <p>{errors.email.message}</p>}
```

RHF는 `formState`를 Proxy 기반으로 관리한다. 컴포넌트가 `errors.email`처럼 필요한 상태를 읽으면, 해당 상태의 변화에 맞춰 화면을 갱신한다.

## 3. 필수값과 패턴 규칙 적용하기

`register`의 두 번째 인자에 검증 규칙을 전달한다. 이메일 검증은 필수 여부와 정규표현식 패턴을 함께 선언할 수 있다.

```tsx
<div>
  <input
    {...register('email', {
      required: '이메일은 필수 입력 항목입니다.',
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: '올바른 이메일 형식이 아닙니다.',
      },
    })}
    placeholder="이메일"
  />
  {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
</div>
```

`required`에는 값이 비어 있을 때 표시할 메시지를 작성한다. `pattern`은 `value`에 정규표현식을, `message`에 규칙을 통과하지 못했을 때 보여줄 문구를 작성한다.

## 4. 길이 제한과 비밀번호 확인 검증

`minLength`는 문자열 길이 규칙을 선언한다. 두 필드의 값을 비교해야 할 때는 `watch`와 `validate`를 사용할 수 있다.

```tsx
<div>
  <input
    type="password"
    {...register('password', {
      required: '비밀번호를 입력해주세요.',
      minLength: {
        value: 8,
        message: '최소 8자 이상이어야 합니다.',
      },
    })}
    placeholder="비밀번호"
  />
  {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
</div>

<div>
  <input
    type="password"
    {...register('passwordConfirm', {
      required: '비밀번호 확인이 필요합니다.',
      validate: (value) =>
        value === watch('password') || '비밀번호가 일치하지 않습니다.',
    })}
    placeholder="비밀번호 확인"
  />
  {errors.passwordConfirm && (
    <p style={{ color: 'red' }}>{errors.passwordConfirm.message}</p>
  )}
</div>
```

`watch('password')`는 현재 비밀번호 필드의 값을 읽는다. `validate` 함수는 `true`를 반환하면 통과하고, `false` 또는 문자열을 반환하면 실패한다. 문자열을 반환한 경우에는 해당 내용이 오류 메시지로 사용된다.

## 5. handleSubmit으로 제출 흐름 보호하기

`handleSubmit`은 제출 함수를 감싸서 등록된 규칙을 먼저 검사한다.

```tsx
const onSave: SubmitHandler<FormInputs> = (data) => {
  console.log('검증을 통과한 데이터:', data)
}

<form onSubmit={handleSubmit(onSave)}>
  <button type="submit">제출</button>
</form>
```

제출 버튼을 누르면 `handleSubmit`이 브라우저의 기본 제출 동작을 막고 모든 필드의 규칙을 검사한다.

- 오류가 있으면 `onSave`를 실행하지 않고 `errors`를 갱신한다.
- 모든 규칙을 통과하면 검증된 `data`를 `onSave`에 전달한다.

따라서 서버 전송과 같은 비즈니스 로직은 `onSave`에 작성하고, 검증과 에러 상태 처리는 RHF에 맡길 수 있다.

## 6. 수동 검증과 선언적 검증 비교

| 구분 | 수동 검증 | 선언적 검증 |
| --- | --- | --- |
| 규칙 작성 | `useEffect` 안에서 조건문과 정규표현식을 작성한다. | `register` 옵션에 규칙을 선언한다. |
| 오류 상태 | 필드마다 별도의 에러 상태를 만든다. | `formState.errors`에서 오류 정보를 읽는다. |
| 필드 간 검증 | 의존성 배열을 직접 관리한다. | `watch`와 `validate`로 비교 규칙을 연결한다. |
| 제출 처리 | `preventDefault`와 조건문을 직접 작성한다. | `handleSubmit`이 검증 후 제출 함수를 실행한다. |
| 유지보수 | 필드 수가 늘수록 상태와 조건문이 증가한다. | 규칙을 필드 가까이에 작성해 확인하기 쉽다. |

## 핵심 포인트

- 선언적 검증은 검증 절차 대신 필드의 규칙을 작성하는 방식이다.
- `mode` 옵션으로 검증이 실행되는 시점을 설정한다.
- `required`, `pattern`, `minLength`로 기본 규칙을 선언한다.
- `watch`와 `validate`를 사용하면 비밀번호 확인처럼 다른 필드의 값과 비교할 수 있다.
- `handleSubmit`은 오류가 없는 경우에만 제출 함수를 실행한다.
