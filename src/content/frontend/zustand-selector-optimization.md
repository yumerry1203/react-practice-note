---
title: "Zustand Selector 최적화: 필요한 상태만 구독하기"
description: "Zustand 셀렉터로 필요한 상태만 구독하고 불필요한 리렌더링을 줄이는 방법"
date: "2026-10-13"
tags:
  - Zustand
  - Selector
---

# Zustand Selector 최적화: 필요한 상태만 구독하기

Zustand 스토어에는 여러 상태가 함께 들어갈 수 있다. 컴포넌트가 스토어 전체를 구독하면 자신과 관계없는 상태가 바뀌어도 다시 렌더링될 수 있다. 셀렉터는 필요한 값만 골라 구독 범위를 좁히는 함수이다.

## 1. 선택적 구독이 필요한 이유

예를 들어 스토어에 곰과 물고기 수가 함께 있다고 가정한다. 곰 수만 보여주는 컴포넌트는 물고기 수가 바뀔 때 다시 렌더링될 필요가 없다.

```ts
const bears = useZooStore((state) => state.bears);
```

`(state) => state.bears`가 셀렉터이다. 이 코드는 스토어 전체가 아니라 `bears` 값만 선택한다.

## 2. 셀렉터의 비교 흐름

스토어 상태가 바뀌면 Zustand는 각 구독자의 셀렉터를 다시 실행하고 이전 선택 결과와 새 선택 결과를 비교한다. 기본 비교는 `Object.is`를 사용한다. 원시값 하나를 선택하는 경우에는 값이 달라졌을 때만 컴포넌트가 다시 렌더링된다.

1. 액션에서 `set`을 호출해 스토어 상태를 갱신한다.
2. Zustand가 구독 중인 셀렉터를 실행한다.
3. 이전 선택 결과와 새 선택 결과를 비교한다.
4. 선택 결과가 달라진 컴포넌트에만 렌더링 신호를 전달한다.

## 3. 동물원 스토어 만들기

곰과 물고기 수를 각각 관리하는 스토어를 만든다.

```ts
// src/store/useZooStore.ts

import { create } from 'zustand';

interface ZooStore {
  bears: number;
  fish: number;
  addBear: () => void;
  addFish: () => void;
}

export const useZooStore = create<ZooStore>((set) => ({
  bears: 0,
  fish: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  addFish: () => set((state) => ({ fish: state.fish + 1 })),
}));
```

`addBear`는 `bears`만, `addFish`는 `fish`만 변경한다. Zustand의 `set`은 한 단계 깊이의 얕은 병합을 수행하므로 변경하지 않은 같은 깊이의 상태는 유지된다.

## 4. 곰 관찰소 컴포넌트

곰 수와 곰 추가 액션만 구독한다.

```tsx
// src/components/BearCounter.tsx

import { useZooStore } from '../store/useZooStore';

export function BearCounter() {
  const bears = useZooStore((state) => state.bears);
  const addBear = useZooStore((state) => state.addBear);

  console.log('곰 컴포넌트가 다시 렌더링된다.');

  return (
    <section>
      <h2>곰 우리</h2>
      <p>현재 곰: {bears}마리</p>
      <button onClick={addBear}>곰 추가</button>
    </section>
  );
}
```

`fish`가 바뀌어도 이 컴포넌트의 셀렉터 결과인 `bears`가 같다면 다시 렌더링되지 않는다.

## 5. 물고기 연못 컴포넌트

물고기 컴포넌트도 같은 방식으로 자신의 상태만 구독한다.

```tsx
// src/components/FishCounter.tsx

import { useZooStore } from '../store/useZooStore';

export function FishCounter() {
  const fish = useZooStore((state) => state.fish);
  const addFish = useZooStore((state) => state.addFish);

  console.log('물고기 컴포넌트가 다시 렌더링된다.');

  return (
    <section>
      <h2>물고기 연못</h2>
      <p>현재 물고기: {fish}마리</p>
      <button onClick={addFish}>물고기 추가</button>
    </section>
  );
}
```

두 컴포넌트는 같은 스토어를 사용하지만, 렌더링 관점에서는 서로 필요한 값만 반응하도록 분리된다.

## 6. 여러 값을 함께 선택할 때

셀렉터에서 새 객체나 새 배열을 바로 만들면 실행할 때마다 새로운 참조가 생성된다. 여러 값을 한 번에 선택해야 한다면 `useShallow`를 사용해 얕은 비교가 가능한 안정적인 결과를 만들 수 있다.

```tsx
import { useShallow } from 'zustand/react/shallow';
import { useZooStore } from '../store/useZooStore';

const { bears, fish } = useZooStore(
  useShallow((state) => ({ bears: state.bears, fish: state.fish })),
);
```

값 하나만 필요하다면 `useZooStore((state) => state.bears)`처럼 단일 셀렉터를 사용하는 방식이 가장 간단하다.

## 7. 사용 원칙

- `useStore()`처럼 스토어 전체를 가져오기보다 필요한 필드를 셀렉터로 선택한다.
- 상태 값과 액션 함수도 각각 셀렉터로 가져올 수 있다.
- 여러 값을 객체나 배열로 묶어 선택할 때는 새 참조 생성에 주의하고 `useShallow`를 고려한다.
- 중첩 객체를 업데이트할 때는 얕은 병합 범위를 이해하고 필요한 객체를 직접 복사한다.

## 정리

- 셀렉터는 스토어에서 필요한 데이터만 구독하는 함수이다.
- 선택한 값이 바뀌지 않으면 관련 없는 상태 변경으로 다시 렌더링되지 않는다.
- 곰과 물고기처럼 독립된 상태를 각각 선택하면 렌더링 비용을 분리할 수 있다.
- 여러 값을 한 번에 선택할 때는 `useShallow`로 불필요한 리렌더링을 줄일 수 있다.
