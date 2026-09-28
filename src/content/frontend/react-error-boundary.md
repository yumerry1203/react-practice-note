---
title: React Error Boundary 공부노트
description: 렌더링 에러가 앱 전체로 퍼지지 않도록 막는 React 안전장치
date: 2026-09-28
tags:
  - react
  - error-boundary
  - typescript
  - reactnode
  - class-component
---

# React Error Boundary 공부노트

> 하위 화면에서 렌더링 에러가 발생해도, 그 영역만 에러 화면으로 바꾸는 안전장치

## 1. Error Boundary란?

`Error Boundary`는 자신이 감싼 하위 React 컴포넌트에서 렌더링 에러가 나면, 앱 전체가 멈추는 대신 **fallback UI(대체 화면)** 를 보여준다.

```tsx
<ErrorBoundary fallback={<p>상품을 불러오지 못했어요.</p>}>
  <ProductList />
</ErrorBoundary>
```

- `children`: 평소에 보여줄 정상 화면 (`ProductList`)
- `fallback`: 에러가 났을 때 대신 보여줄 화면

## 2. `ReactNode`

`ReactNode`는 React가 화면에 렌더링할 수 있는 값들을 넓게 묶은 타입이다.

```tsx
const title: React.ReactNode = <h1>안녕</h1>;
const text: React.ReactNode = "텍스트";
const number: React.ReactNode = 123;
const empty: React.ReactNode = null;
```

그래서 Error Boundary의 `children`과 `fallback`에 어떤 UI가 들어와도 받을 수 있다.

## 3. 직접 구현할 때 클래스 컴포넌트가 나오는 이유

보통 React는 함수형 컴포넌트와 Hooks를 사용한다. 하지만 Error Boundary를 직접 만들 때는 클래스 컴포넌트의 특별한 메서드를 사용한다.

```tsx
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }
}
```

- `getDerivedStateFromError`: 에러가 나면 상태를 바꾼다.
- `componentDidCatch`: 에러 정보를 기록하거나 외부 에러 서비스에 보낼 때 쓴다.

## 4. `hasError` 흐름

```text
처음: hasError = false → children 표시
에러 발생 → hasError = true → fallback 표시
```

```tsx
render() {
  if (this.state.hasError) return this.props.fallback;
  return this.props.children;
}
```

## 5. `unknown` 에러를 안전하게 다루기

TypeScript에서 `catch`로 받은 값은 무엇이 올지 알 수 없으므로 `unknown`으로 다루는 것이 안전하다. `instanceof Error`로 진짜 Error인지 확인한 뒤 메시지를 사용한다.

```tsx
try {
  // 어떤 작업
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

## 6. `Bomb` 컴포넌트

`Bomb`은 Error Boundary가 제대로 작동하는지 확인하려고 일부러 에러를 내는 테스트용 컴포넌트다.

```tsx
function Bomb() {
  throw new Error("테스트 에러");
}
```

## 핵심 요약

- Error Boundary는 하위 화면의 렌더링 에러를 격리하고 fallback UI를 보여준다.
- `children`은 정상 화면, `fallback`은 에러 화면이다.
- `ReactNode`는 React가 렌더링할 수 있는 값들의 포괄 타입이다.
- 직접 구현할 때는 클래스 컴포넌트의 `getDerivedStateFromError`, `componentDidCatch`를 사용한다.
- 에러가 나면 `hasError`가 `false`에서 `true`가 되고 fallback이 보인다.
- `unknown` 값은 `instanceof Error`로 좁힌 뒤 안전하게 사용한다.

#react #error-boundary #typescript #reactnode #class-component #frontend
