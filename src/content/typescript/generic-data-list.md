---
title: "제네릭으로 재사용 가능한 DataList 만들기"
description: "extends 제약과 renderRow를 사용해 서로 다른 데이터를 안전하게 출력하는 제네릭 목록을 정리한다."
date: "2026-09-01"
tags:
  - TypeScript
  - Generic
  - extends
  - React
---

# 제네릭으로 재사용 가능한 DataList 만들기

하나의 `DataList` 컴포넌트에 사용자와 상품 타입을 각각 주입해 서로 다른 목록을 렌더링했다.

## 1. 제네릭 Props 정의하기

```tsx
interface DataListProps<T extends { id: string | number }> {
  items: T[]
  renderRow: (item: T) => React.ReactNode
}
```

`T`를 사용할 때 타입이 결정된다. `extends` 제약으로 모든 항목에 `string` 또는 `number` 타입의 `id`가 있도록 보장한다.

## 2. 공통 목록 구조 만들기

```tsx
export function DataList<T extends { id: string | number }>({
  items,
  renderRow,
}: DataListProps<T>) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{renderRow(item)}</div>
      ))}
    </div>
  )
}
```

목록의 공통 반복 구조는 `DataList`가 담당하고, 각 행의 내용은 `renderRow`로 외부에서 전달한다.

## 3. 서로 다른 타입 주입하기

```tsx
<DataList<User>
  items={users}
  renderRow={(user) => <strong>{user.displayName}</strong>}
/>

<DataList<Product>
  items={products}
  renderRow={(product) => <span>{product.title}</span>}
/>
```

타입을 주입하면 `renderRow`의 매개변수도 해당 타입으로 유지된다.

## 정리

- 제네릭은 사용할 때 구체적인 타입을 주입한다.
- `extends`로 목록 항목에 필요한 최소 조건을 보장한다.
- `renderRow`로 공통 구조와 타입별 표현 방식을 분리한다.
