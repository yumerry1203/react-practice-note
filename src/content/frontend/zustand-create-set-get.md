---
title: "Zustand 엔진 - create, set, get으로 완성하는 상태 조립"
description: "Zustand Store를 구성하는 create, set, get의 역할과 셀렉터 기반 상태 구독 흐름"
date: "2026-10-02"
tags:
  - Zustand
  - Store
  - create()
  - set()
  - get()
---

# Zustand 엔진 - create, set, get으로 완성하는 상태 조립

Zustand Store를 만들 때 사용하는 `create`, `set`, `get`의 역할을 정리했다. 상태를 정의하고, 변경하고, 현재 값을 읽는 흐름을 이해하는 것이 핵심이다.

## 1. `create`로 Store 만들기

`create`는 상태와 액션을 하나의 Store로 정의하고, 컴포넌트에서 사용할 커스텀 훅을 반환한다. Store는 리액트 컴포넌트 트리 **외부에 독립적으로** 존재한다.

```ts
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

위 Store에는 `count` 상태와 값을 변경하는 `increment` 액션이 함께 들어 있다. `create`의 콜백 인자로 전달되는 `set`, `get`은 Store 내부의 상태를 다루는 도구다.

## 2. 외부 Store와 리액트 구독을 위한 useSyncExternalStore

Zustand는 리액트 외부에 상태를 저장하지만, 컴포넌트가 Store를 구독하면 상태 변화에 맞춰 화면을 업데이트할 수 있다. 리액트 18 이상에서는 외부 Store와 렌더링 흐름을 연결하기 위해 `useSyncExternalStore` API를 사용한다.
set함수가 실행될 때 마다 자동으로 render()가 실행되지 않기 때문에 렌더링 하라고 신호를 보내준다라고 이해
다음 순서로 동작한다.

```ts
const state = useSyncExternalStore(
  store.subscribe,
  store.getState,
)
```

1. 컴포넌트가 Store의 상태를 구독한다.
2. `set`으로 상태가 바뀌면 Store가 React Component에게 변경을 알린다.
3. 리액트는 최신 상태를 확인하고 필요한 컴포넌트를 다시 렌더링한다.

외부 상태가 업데이트되는 동안 서로 다른 컴포넌트가 다른 값을 보여주는 문제를 줄이기 위해, 리액트는 외부 Store의 스냅샷을 렌더링 흐름과 연결한다.

## 3. `set`으로 상태 변경하기

`set`은 Store 상태를 변경하는 함수다. 객체를 전달해 일부 상태만 바꾸거나, 현재 상태를 바탕으로 다음 값을 계산하는 함수형 업데이트를 사용할 수 있다.

### 얕은 병합

객체를 전달하면 바꾸려는 속성만 업데이트한다.

```ts
set({ username: '새로운 사용자' })
```

`username`만 변경하고 `points`, `isLoggedIn`처럼 전달하지 않은 다른 상태는 유지한다.

### 함수형 업데이트

현재 상태를 기준으로 다음 값을 계산할 때 사용한다.

```ts
set((state) => ({ points: state.points + 10 }))
```

이 방식은 이전 상태를 기준으로 계산해야 하는 증가, 감소, 배열 추가 같은 로직에 적합하다.

## 4. `get`으로 현재 상태 읽기

`get`은 Store 내부 액션에서 최신 상태를 읽을 때 사용한다. 컴포넌트에서 셀렉터로 구독하는 것과 달리, `get()` 호출 자체가 화면 리렌더링을 만들지는 않는다.

```ts
const currentPoints = get().points

if (currentPoints > 100) {
  set({ rank: 'VIP' })
}
```

조건문, 로그 기록, 여러 상태를 함께 계산하는 액션 내부에서 현재 값을 확인할 때 유용하다.

## 5. `create`, `set`, `get` 통합하기

```ts
import { create } from 'zustand'

interface UserStore {
  username: string
  points: number
  isLoggedIn: boolean
  increasePoints: (amount: number) => void
  resetUser: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  username: '아키텍트',
  points: 100,
  isLoggedIn: true,

  increasePoints: (amount) => set((state) => ({
    points: state.points + amount,
  })),

  resetUser: () => {
    const currentPoints = get().points

    if (currentPoints > 0) {
      console.log(`${get().username}님의 ${currentPoints}포인트가 초기화됩니다.`)
      set({ username: '', points: 0, isLoggedIn: false })
    }
  },
}))
```

`create<UserStore>`는 Store가 `UserStore` 인터페이스를 따르도록 만든다. `increasePoints`는 `set`으로 이전 상태를 기준으로 점수를 바꾸고, `resetUser`는 `get`으로 현재 점수를 확인한 뒤 `set`으로 상태를 초기화한다.

## 정리

- `create`는 상태와 액션을 포함한 Store 훅을 만든다.
- `set`은 일부 상태를 병합하거나 현재 상태를 기준으로 다음 값을 계산한다.
- `get`은 Store 액션 내부에서 최신 상태를 읽는다.
- 컴포넌트에서는 셀렉터로 필요한 상태만 구독한다.
- 상태 변경, 현재 값 확인, 구독 흐름을 분리하면 Store 로직을 더 명확하게 구성할 수 있다.
