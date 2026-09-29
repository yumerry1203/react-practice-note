---
title: "React 입력 이벤트 타입 지정하기"
description: "React 입력 이벤트에 정확한 타입을 지정하고 입력값을 상태에 실시간으로 반영하는 방법을 정리한다."
date: "2026-09-01"
tags:
  - React
  - TypeScript
  - ChangeEvent
  - useState
---

# React 입력 이벤트 타입 지정하기

입력창의 변경 이벤트에 타입을 지정하고 `useState`로 입력값을 화면에 반영했다.

## 1. 문자열 상태 만들기

```tsx
const [text, setText] = useState<string>('')
```

상태의 타입을 `string`으로 지정해 입력값이 문자열이라는 사실을 명확하게 했다.

## 2. 입력 이벤트 타입 지정하기

```tsx
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setText(event.target.value)
}
```

`React.ChangeEvent<HTMLInputElement>`를 사용하면 이벤트가 입력 요소에서 발생한다는 것을 알 수 있다. 따라서 `event.target.value`에 안전하게 접근할 수 있다.

```tsx
<input value={text} onChange={handleChange} />
<p>입력된 값: {text}</p>
```

입력값이 바뀔 때마다 상태가 갱신되고 화면에도 현재 값이 표시된다.

## 정리

- `useState<string>`으로 입력값의 타입을 고정한다.
- 입력 요소의 변경 이벤트에는 `React.ChangeEvent<HTMLInputElement>`를 사용한다.
- `value`와 `onChange`를 연결해 입력값을 상태로 관리한다.
