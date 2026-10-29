---
title: "Zod 스키마로 React Hook Form 검증 규칙 만들기"
description: "Zod 스키마와 zodResolver를 연결해 폼 데이터 타입과 검증 규칙을 하나의 설계도에서 관리한다"
date: "2026-10-29"
tags:
  - Zod
  - React Hook Form
  - Schema Validation
  - TypeScript
---

# Zod 스키마로 React Hook Form 검증 규칙 분리하기

React Hook Form의 `register` 안에 검증 규칙을 작성하면 작은 폼에서는 빠르게 구현할 수 있다. 하지만 동일한 이메일, 비밀번호 규칙이 여러 폼에서 반복되거나 필드 수가 많아지면 규칙을 복사하고 수정하는 비용이 커진다.

Zod는 데이터의 형태와 검증 규칙을 스키마로 분리한다. React Hook Form에는 `zodResolver`를 연결해 스키마 검증 결과를 전달한다.

## 1. 설치와 역할

```bash
npm install zod @hookform/resolvers
```

| 도구 | 역할 |
| --- | --- |
| `zod` | 데이터의 타입, 형식, 범위를 스키마로 선언하고 검증한다. |
| `@hookform/resolvers` | Zod의 검증 결과를 React Hook Form이 사용할 수 있는 오류 형식으로 연결한다. |

## 2. Zod의 기본 문법

Zod는 `z` 객체에서 타입별 스키마를 만든다.

```ts
import { z } from 'zod'

const nameSchema = z.string()
const ageSchema = z.number()
const notificationSchema = z.boolean()
```

`z.string()`, `z.number()`, `z.boolean()`은 각각 문자열, 숫자, 불리언 값인지 검사한다. 여러 필드를 하나의 데이터 단위로 묶을 때는 `z.object()`를 사용한다.

## 3. 자주 사용하는 검증 규칙

Zod의 메서드는 체이닝으로 연결한다. Zod 4에서는 오류 메시지 옵션으로 `error`를 사용할 수 있다.

```ts
import { z } from 'zod'

const ageSchema = z
  .number()
  .min(19, { error: '성인만 가입 가능합니다.' })
  .max(100, { error: '나이를 확인해주세요.' })

const roleSchema = z.enum(['admin', 'user', 'guest'], {
  error: '권한을 반드시 선택해야 합니다.',
})

const nicknameSchema = z.string().optional()
const bioSchema = z.string().nullable()

const phoneSchema = z.string().regex(/^\d{3}-\d{3,4}-\d{4}$/, {
  error: '010-0000-0000 형식을 지켜주세요.',
})

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ error: '이메일 형식이 아닙니다.' })
```

- `min`, `max`: 숫자나 문자열의 최소, 최대 범위를 검사한다.
- `enum`: 허용된 선택지 중 하나인지 검사한다.
- `optional`: 값이 없어도 통과하도록 설정한다.
- `nullable`: `null` 값을 허용한다.
- `regex`: 정규표현식 패턴을 검사한다.
- `trim`, `toLowerCase`: 검증 전 문자열을 변형한다.

## 4. 스키마와 타입을 함께 만들기

회원가입 폼의 규칙을 컴포넌트 밖 `authSchema.ts` 파일로 분리할 수 있다.

```ts
import { z } from 'zod'

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { error: '이메일은 필수 입력 사항입니다.' })
      .email({ error: '유효한 이메일 형식이 아닙니다.' }),

    password: z
      .string()
      .min(8, { error: '비밀번호는 최소 8자 이상이어야 합니다.' })
      .regex(/[A-Z]/, { error: '대문자를 최소 하나 포함해야 합니다.' })
      .regex(/[0-9]/, { error: '숫자를 최소 하나 포함해야 합니다.' }),

    passwordConfirm: z
      .string()
      .min(1, { error: '비밀번호 확인을 입력해주세요.' }),

    role: z.enum(['user', 'creator'], {
      error: '가입 유형을 선택해주세요.',
    }),

    age: z
      .number({ error: '나이를 입력해주세요.' })
      .min(14, { error: '만 14세 이상만 가입 가능합니다.' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })

export type SignupInput = z.infer<typeof signupSchema>
```

`z.object()`는 회원가입에 필요한 필드를 하나의 객체로 묶는다. `refine`은 객체 전체를 받아 비밀번호와 비밀번호 확인처럼 여러 필드의 관계를 검사한다. `path: ['passwordConfirm']`을 지정하면 오류 메시지를 비밀번호 확인 필드에 연결할 수 있다.

`z.infer<typeof signupSchema>`는 스키마에서 TypeScript 타입을 추출한다. 스키마를 수정하면 `SignupInput`도 함께 바뀌므로, 타입 정의와 검증 규칙이 분리되지 않는다.

## 5. React Hook Form에 Zod 연결하기

`zodResolver`를 `useForm`의 `resolver`에 전달하면 입력값이 Zod 스키마를 기준으로 검증된다.

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signupSchema, type SignupInput } from '../schemas/authSchema'

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<SignupInput>({
  resolver: zodResolver(signupSchema),
  mode: 'onChange',
})
```

`resolver`는 React Hook Form과 Zod 사이에서 현재 폼 값을 전달하고 검증 오류를 `errors` 형식으로 변환한다. `mode: 'onChange'`를 사용하면 입력할 때마다 스키마 검증 결과가 갱신된다.

## 6. 폼 컴포넌트에 적용하기

컴포넌트에서는 검증 규칙을 직접 작성하지 않고 필드를 등록하고 오류를 표시하는 역할에 집중한다.

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { signupSchema, type SignupInput } from '../schemas/authSchema'

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<SignupInput> = (data) => {
    console.log('검증을 통과한 데이터:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        이메일
        <input {...register('email')} placeholder="example@mail.com" />
      </label>
      {errors.email && <p>{errors.email.message}</p>}

      <label>
        비밀번호
        <input type="password" {...register('password')} />
      </label>
      {errors.password && <p>{errors.password.message}</p>}

      <label>
        비밀번호 확인
        <input type="password" {...register('passwordConfirm')} />
      </label>
      {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}

      <label>
        가입 유형
        <select {...register('role')}>
          <option value="user">사용자</option>
          <option value="creator">크리에이터</option>
        </select>
      </label>
      {errors.role && <p>{errors.role.message}</p>}

      <label>
        나이
        <input type="number" {...register('age', { valueAsNumber: true })} />
      </label>
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit">가입하기</button>
    </form>
  )
}
```

HTML 숫자 입력값은 기본적으로 문자열로 전달된다. `age` 스키마가 `z.number()`를 사용하므로 `register('age', { valueAsNumber: true })`로 숫자로 변환해 스키마 타입과 입력값의 타입을 맞춘다.

## 7. register 규칙과 Zod 스키마 비교

| 구분 | `register` 규칙 | Zod 스키마 |
| --- | --- | --- |
| 규칙 위치 | 컴포넌트의 입력 요소 안 | 스키마 파일 |
| 재사용 | 같은 규칙을 여러 폼에 다시 작성할 수 있다. | 하나의 스키마를 여러 곳에서 사용할 수 있다. |
| 타입 관리 | 폼 타입을 별도로 선언한다. | `z.infer`로 스키마에서 타입을 추출한다. |
| 필드 간 검증 | `watch`, `validate`를 사용한다. | 객체 단위 `refine`으로 관계를 검사한다. |
| 컴포넌트 역할 | 규칙과 UI를 함께 관리한다. | 입력 요소와 오류 출력에 집중한다. |

## 핵심 포인트

- Zod 스키마는 데이터의 타입과 검증 규칙을 한곳에서 관리한다.
- `z.infer`를 사용하면 스키마에서 폼 데이터 타입을 추출할 수 있다.
- `zodResolver`는 Zod의 검증 결과를 React Hook Form의 `errors` 객체로 연결한다.
- `refine`과 `path`를 사용하면 여러 필드를 비교하고 오류 위치를 지정할 수 있다.
- 숫자 입력은 `valueAsNumber`를 사용해 `z.number()`와 타입을 맞춘다.
