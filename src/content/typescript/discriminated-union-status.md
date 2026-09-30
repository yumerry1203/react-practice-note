---
title: "상태에 따라 서로 다른 데이터 표시하기"
description: "loading, success, error 상태에 따라 사용할 수 있는 데이터를 안전하게 제한하는 방법"
date: "2026-09-01"
tags:
  - Discriminated Union
  - Narrowing
---

# 구별된 공용체로 상태별 데이터 표시하기

데이터 요청 상태를 `loading`, `success`, `error`로 나누고 각 상태에 필요한 값만 사용할 수 있도록 타입을 정의했다.

## 1. 상태 타입 정의하기

```ts
type FetchStatus =
  | { state: 'loading' }
  | { state: 'success'; data: string }
  | { state: 'error'; error: Error }
```

공통 속성인 `state`의 값에 따라 `data` 또는 `error`의 존재 여부가 달라진다.

## 2. 상태를 확인해 타입 좁히기

```tsx
function StatusDisplay({ status }: { status: FetchStatus }) {
  if (status.state === 'success') {
    return <div>성공: {status.data}</div>
  }

  if (status.state === 'error') {
    return <div>에러 발생: {status.error.message}</div>
  }

  return <div>데이터를 불러오는 중이다.</div>
}
```

`state`를 확인하면 TypeScript가 현재 상태의 타입을 좁힌다. 성공 분기에서만 `data`를 사용하고 오류 분기에서만 `error`를 사용할 수 있다.

## 정리

- 구별된 공용체는 공통 이름표를 가진 여러 타입을 묶는다.
- `state` 조건문으로 현재 타입을 좁힐 수 있다.
- 상태별로 존재하는 데이터가 달라지는 구조를 안전하게 표현한다.
