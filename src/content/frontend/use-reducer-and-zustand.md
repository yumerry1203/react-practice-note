---
title: "상태 관리 함수 useReducer의 한계와 zustand를 사용하는 이유"
description: "리액트 내장 훅 useReducer의 흐름과 보일러플레이트 발생"
date: "2026-10-12"
tags:
  - useReducer
  - Zustand
---



## 1. useReducer의 역할

`useReducer`는 컴포넌트 내부의 복잡한 상태 로직을 분리하고, 예측 가능한 상태 변경을 만들기 위한 React 내장 훅이다. 현재 상태와 액션을 받아 규칙에 맞는 새 상태를 반환한다.  

- **Action**: 어떤 상태 변경을 요청하는 객체
- **dispatch**: 액션을 reducer에 전달하는 함수
- **Reducer**: 현재 상태와 액션을 받아 새 상태를 계산하는 순수 함수

상태를 직접 변경하지 않고, 액션을 전달한 뒤 reducer가 새 객체를 반환하는 흐름으로 동작한다.

## 2. useReducer에서 늘어나는 코드

작은 기능을 추가하더라도 액션 타입, reducer의 `switch` 문, `dispatch` 호출부를 함께 수정해야 한다. 기능이 많아질수록 반복되는 구조를 보일러플레이트라고 부른다.

- 액션이 추가될 때마다 유니온 타입을 수정해야 한다.
- 액션 처리 로직을 `switch` 문에 추가해야 한다.
- UI에서는 액션 객체를 만들어 `dispatch`해야 한다.
- 객체 상태를 갱신할 때 기존 값을 유지하기 위해 `...state`를 반복해서 작성한다.

## 3. useReducer 카운터 예시

카운터 변경과 메시지 변경을 구현한 예시이다.

```tsx
// src/components/PainfulCounter.tsx

import { useReducer } from 'react';

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'UPDATE_MESSAGE'; payload: string };

interface State {
  count: number;
  message: string;
}

const initialState: State = {
  count: 0,
  message: '안녕하세요!',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'UPDATE_MESSAGE':
      return { ...state, message: action.payload };
    default:
      return state;
  }
}

export function PainfulCounter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>카운트: {state.count} | 메시지: {state.message}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        증가
      </button>
      <button onClick={() => dispatch({ type: 'UPDATE_MESSAGE', payload: '반가워요!' })}>
        메시지 변경
      </button>
    </div>
  );
}
```

`INCREMENT` 기능 하나를 추가하려면 `Action` 타입, reducer의 분기, UI의 `dispatch` 호출이 함께 필요하다. 상태가 중첩되면 새 상태를 만들기 위한 스프레드 연산자도 더 깊게 작성해야 한다.

## 4. 코드에서 확인할 점

### Action Type

`Action`은 발생할 수 있는 상태 변경을 모두 정의한다. `UPDATE_MESSAGE`처럼 추가 데이터가 필요하면 `payload`를 함께 정의한다.

### Reducer Function

reducer는 전달받은 `state`와 `action`만으로 새 상태를 반환한다. 기존 상태 객체를 직접 바꾸지 않고 `...state`로 기존 속성을 복사한 뒤 필요한 값만 변경한다.

### dispatch

`dispatch({ type: 'INCREMENT' })`처럼 액션 객체를 만들어 reducer에 전달한다. Zustand에서는 액션 함수를 직접 호출하는 반면, `useReducer`는 dispatch를 거쳐 상태를 변경한다.

## 5. useReducer와 Zustand를 선택하는 기준

`useReducer`가 항상 불리한 방식은 아니다. 상태의 범위와 복잡도에 따라 선택한다. 

| 상황 | 적합한 선택 | 이유 |
| --- | --- | --- |
| 특정 컴포넌트 안에서만 사용하는 복잡한 상태 | `useReducer` | 상태 전환 규칙을 한 reducer에 모아 관리할 수 있다. |
| 외부 라이브러리 없이 상태 로직을 분리해야 하는 경우 | `useReducer` | React 내장 기능만으로 구현할 수 있다. |
| 여러 화면과 도메인에서 공유하는 전역 상태 | Zustand | Provider와 복잡한 dispatch 흐름 없이 스토어를 분리해 관리할 수 있다. |
| 빠르게 상태와 액션을 추가해야 하는 경우 | Zustand | 액션 타입과 `switch` 문을 반복해서 작성하지 않아도 된다. |

## 정리

- `useReducer`는 액션, dispatch, reducer를 통해 상태를 예측 가능하게 변경한다.
- 상태 변경 규칙이 복잡한 로컬 상태에서는 `useReducer`가 적합할 수 있다.
- 액션과 상태가 늘어날수록 타입, reducer, UI를 함께 수정해야 하는 보일러플레이트가 생긴다.
- 여러 화면에서 공유하는 전역 상태나 빠르게 확장되는 상태는 Zustand가 더 간결할 수 있다.
