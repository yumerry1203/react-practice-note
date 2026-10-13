---
title: "상태 관리 함수 useReducer의 한계와 zustand를 사용하는 이유"
description: "리액트 내장 훅 useReducer의 흐름과 보일러플레이트 발생, 그리고 Zustand를 사용하여 편리하고 안전하게 관리하기"
date: "Last Updated · 2026-10-13"
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

## 6. useReducer 선택 기준 정리

- `useReducer`는 액션, dispatch, reducer를 통해 상태를 예측 가능하게 변경한다.
- 상태 변경 규칙이 복잡한 로컬 상태에서는 `useReducer`가 적합할 수 있다.
- 액션과 상태가 늘어날수록 타입, reducer, UI를 함께 수정해야 하는 보일러플레이트가 생긴다.
- 여러 화면에서 공유하는 전역 상태나 빠르게 확장되는 상태는 Zustand가 더 간결할 수 있다.

## 7. Zustand의 선언적 상태 변경

Zustand에서는 액션 타입을 만들고 `switch` 문에서 분기하는 대신, 상태를 바꾸는 함수를 스토어에 직접 정의한다. 함수 이름이 액션의 의미를 나타내고, 함수 안의 `set` 호출이 상태 변경 규칙을 담당한다.

```ts
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}));
```

`increase`라는 함수를 보면 어떤 상태가 어떻게 바뀌는지 바로 알 수 있다. 별도의 액션 객체나 `dispatch` 호출을 만들지 않아도 된다.

## 8. set의 얕은 병합

Zustand의 `set`은 기본적으로 한 단계 깊이의 얕은 병합을 수행한다. 변경할 속성만 전달하면 같은 깊이에 있는 나머지 상태는 유지된다.

```ts
updateMessage: (nextMessage: string) => set({ message: nextMessage }),
```

위 코드에서는 `message`만 전달했지만 `count`는 그대로 유지된다. `useReducer`에서 `{ ...state, message: nextMessage }`처럼 같은 깊이의 기존 상태를 직접 펼쳐 적는 코드가 줄어든다.

다만 중첩 객체의 내부 속성까지 자동으로 깊게 병합되지는 않는다. 중첩 상태를 바꿀 때는 필요한 객체를 직접 복사해 새 값으로 만들어야 한다.

## 9. 선언적 Zustand 스토어 만들기

상태와 액션을 하나의 인터페이스와 스토어 안에 정의할 수 있다.

```ts
// src/store/useSimpleStore.ts

import { create } from 'zustand';

interface SimpleStore {
  count: number;
  message: string;
  increase: () => void;
  updateMessage: (nextMessage: string) => void;
  reset: () => void;
}

export const useSimpleStore = create<SimpleStore>((set) => ({
  count: 0,
  message: '안녕하세요!',
  increase: () => set((state) => ({ count: state.count + 1 })),
  updateMessage: (nextMessage) => set({ message: nextMessage }),
  reset: () => set({ count: 0, message: '초기화됨' }),
}));
```

`increase`는 이전 값이 필요하므로 함수형 업데이트를 사용한다. `updateMessage`와 `reset`처럼 새 값이 명확한 경우에는 객체를 바로 전달할 수 있다. `updateMessage`의 매개변수에 `string`을 지정했기 때문에 문자열이 아닌 값을 전달하면 타입 오류를 확인할 수 있다.

## 10. UI에서 액션 호출하기

컴포넌트에서는 필요한 상태와 액션을 셀렉터로 가져와 직접 호출한다.

```tsx
import { useSimpleStore } from '../store/useSimpleStore';

export function SimpleCounter() {
  const count = useSimpleStore((state) => state.count);
  const message = useSimpleStore((state) => state.message);
  const increase = useSimpleStore((state) => state.increase);
  const updateMessage = useSimpleStore((state) => state.updateMessage);

  return (
    <section>
      <h1>{message}</h1>
      <p>현재 숫자: {count}</p>
      <button onClick={increase}>숫자 올리기</button>
      <button onClick={() => updateMessage('Zustand는 간결하다.')}>
        메시지 변경
      </button>
    </section>
  );
}
```

`onClick={increase}`처럼 액션을 이벤트에 직접 연결할 수 있다. `dispatch({ type: '...' })` 형태의 객체를 만들 필요가 없고, 셀렉터를 사용하면 해당 값이 바뀔 때만 컴포넌트가 다시 렌더링된다.

## 11. useReducer와 Zustand 비교

| 구분 | useReducer | Zustand |
| --- | --- | --- |
| 액션 정의 | 액션 타입과 객체를 별도로 정의한다. | 스토어의 함수가 액션 역할을 한다. |
| 상태 변경 | reducer의 `switch` 문에서 처리한다. | 액션 함수 안에서 `set`으로 처리한다. |
| 불변성 | 같은 깊이의 상태를 `...state`로 직접 복사하는 경우가 많다. | 변경할 속성만 `set`에 전달할 수 있다. |
| 기능 추가 | 타입, reducer, UI 호출부를 함께 수정한다. | 스토어에 액션 함수를 추가한다. |

## 최종 정리

- `useReducer`는 복잡한 로컬 상태의 전환 규칙을 관리할 때 유용하다.
- Zustand는 상태 변경 함수와 스토어를 가깝게 두어 전역 상태를 간결하게 관리할 수 있다.
- Zustand의 `set`은 얕은 병합을 수행하므로 같은 깊이의 다른 상태를 유지한 채 필요한 값만 바꿀 수 있다.
- 컴포넌트에서는 셀렉터로 필요한 상태와 액션만 구독하고 직접 호출한다.
