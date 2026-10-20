---
title: "Zustand와 Immer로 중첩 상태 관리하기"
description: "Zustand의 Immer 미들웨어와 draft를 사용해 깊은 중첩 상태를 안전하고 간결하게 수정하는 방법을 정리한다."
date: "2026-10-20"
tags:
  - React
  - Zustand
  - Immer
  - Nested State
---

# Zustand와 Immer로 중첩 상태 관리하기

상태 구조가 깊어질수록 스프레드 연산자만으로 불변성을 유지하는 코드는 빠르게 복잡해진다. Zustand에 Immer 미들웨어를 결합하면 중첩된 상태를 일반 변수처럼 수정하는 형태로 더 직관적으로 관리할 수 있다.

## 1. 중첩 객체와 불변성 관리

유저 정보 안에 설정이 있고, 설정 안에 테마 정보가 있는 것처럼 중첩된 객체를 수정할 때는 변경한 경로의 모든 상위 객체를 새로 복사해야 한다.

```ts
const nextState = {
  ...state,
  castle: {
    ...state.castle,
    floor3: {
      ...state.castle.floor3,
      bed: { ...state.castle.floor3.bed, color: 'red' },
    },
  },
}
```

침대 색상 하나를 바꾸기 위해 최상위 객체부터 해당 경로까지 모두 복사한다. 구조가 더 깊어질수록 스프레드 연산자와 중괄호가 늘어나며, 누락이나 잘못된 경로 때문에 버그가 생기기 쉬워진다.

## 2. Immer와 Proxy

Immer는 원본 상태를 직접 수정하지 않고, **draft**라는 임시 초안을 제공한다. draft는 자바스크립트의 **Proxy**를 사용해 만들어진다.

Proxy는 객체에 대한 읽기와 쓰기 요청을 중간에서 가로챌 수 있는 기능이다. Immer는 draft에 값을 대입하는 동작을 기록한 뒤, 작업이 끝나면 변경된 부분만 반영한 새로운 불변 객체를 만든다.

```ts
const target = { count: 0 }

const draft = new Proxy(target, {
  set(_obj, prop, value) {
    console.log(`${String(prop)}을 ${value}로 바꾸라는 요청을 기록한다.`)
    return true
  },
})

draft.count = 10
```

위 코드는 Proxy가 대입 연산을 가로챌 수 있다는 개념을 단순화한 예시이다. 실제 Immer는 변경 기록을 바탕으로 새로운 상태를 안전하게 생성한다.

## 3. 스프레드 방식과 Immer 방식

Zustand에서 중첩된 테마 값을 바꾸는 코드를 비교하면 차이가 더 분명해진다.

```ts
// 스프레드 방식
set((state) => ({
  user: {
    ...state.user,
    settings: {
      ...state.user.settings,
      theme: 'dark',
    },
  },
}))
```

```ts
// Immer 미들웨어를 적용한 방식
set((draft) => {
  draft.user.settings.theme = 'dark'
})
```

Immer 방식에서는 데이터를 어떻게 복사할지 고민할 필요 없이, 변경하려는 값의 경로에 바로 대입할 수 있다. 단, 이 방식은 Zustand의 `immer` 미들웨어를 적용한 `set`에서만 사용할 수 있다.

## 4. 깊은 중첩 구조를 가진 스토어 만들기

`zustand/middleware/immer`의 `immer`로 스토어를 감싸면 `set` 콜백에서 draft를 사용할 수 있다.

```tsx
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UserStore {
  user: {
    profile: {
      name: string
      settings: {
        theme: string
        notifications: boolean
      }
    }
  }
  updateTheme: (newTheme: string) => void
  toggleNotifications: () => void
}

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    user: {
      profile: {
        name: 'React Expert',
        settings: {
          theme: 'light',
          notifications: true,
        },
      },
    },
    updateTheme: (newTheme) =>
      set((draft) => {
        draft.user.profile.settings.theme = newTheme
      }),
    toggleNotifications: () =>
      set((draft) => {
        draft.user.profile.settings.notifications =
          !draft.user.profile.settings.notifications
      }),
  }))
)
```

`updateTheme`은 깊은 경로의 테마 값만 변경한다. `toggleNotifications`는 알림 설정 값을 반전한다. 두 액션 모두 직접 값을 바꾸는 것처럼 작성하지만, Immer가 불변성을 유지한 새로운 상태를 만든다.

## 5. draft를 사용하는 이유

`set`의 인자 이름을 `state` 대신 `draft`로 작성하면 해당 객체가 Proxy 기반의 임시 초안이라는 점을 드러낼 수 있다.

TypeScript는 `UserStore` 인터페이스를 기준으로 `draft.user.profile.settings` 경로의 타입을 끝까지 추적한다. 따라서 자동 완성을 통해 접근 가능한 프로퍼티를 확인할 수 있고, 잘못된 키나 값의 타입도 미리 확인할 수 있다.

## 6. 일반 방식과 Immer 방식 비교

| 구분 | 스프레드 방식 | Immer 방식 |
| --- | --- | --- |
| 코드 작성 | 변경 경로의 상위 객체를 모두 복사한다 | 변경할 경로에 값을 바로 대입한다 |
| 구조가 깊어질 때 | 스프레드 연산자가 계속 늘어난다 | 작성 방식이 크게 달라지지 않는다 |
| 유지보수 | 중괄호와 경로 누락을 확인해야 한다 | 변경하려는 비즈니스 값에 집중할 수 있다 |
| 타입 지원 | 복사 과정이 길어질수록 읽기 어려워진다 | 경로를 따라가며 타입 자동 완성을 받을 수 있다 |

## 정리

- 중첩 상태는 일반적인 스프레드 방식으로 수정할 수 있지만, 깊이가 늘어날수록 코드가 복잡해진다.
- Immer는 Proxy 기반 draft를 제공해 직접 수정하는 형태의 코드를 안전한 불변 업데이트로 처리한다.
- Zustand에서는 `immer` 미들웨어를 적용한 뒤 `set((draft) => {})` 형태로 사용할 수 있다.
- Immer는 중첩 상태의 복사 절차보다 실제로 변경해야 하는 값에 집중하게 해준다.
