---
title: "reduce(), filter(), map() 정리"
description: "배열에서 값을 누적하고, 원하는 항목을 고르고, 화면용 데이터로 바꾸는 세 가지 메서드"
date: 2026-09-28
tags: [JavaScript, Array, reduce, filter, map, React]
---

# reduce(), filter(), map() 정리

배열을 다룰 때는 모든 항목을 그대로 쓰기보다, 필요한 것만 고르거나 새로운 모양으로 바꾸는 일이 많아. `filter()`는 고르고, `map()`은 바꾸고, `reduce()`는 하나의 결과로 누적해.

## filter(): 조건에 맞는 항목만 고르기

`filter()`는 조건을 통과한 항목으로 만든 **새 배열**을 반환해. 원본 배열은 바뀌지 않아.

```js
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(number => number % 2 === 0);

console.log(evenNumbers); // [2, 4]
console.log(numbers); // [1, 2, 3, 4, 5]
```

### 오늘 프로젝트에서의 활용: 카테고리 게시글 고르기

게시글 경로 목록에서 현재 카테고리가 포함된 경로만 골랐어.

```js
const categoryPosts = Object.keys(posts).filter(path =>
  path.includes(`/content/${category}/`)
);
```

예를 들어 `category`가 `javascript`라면 `'/content/javascript/'`가 들어 있는 Markdown 경로만 `categoryPosts`에 남아.

## map(): 모든 항목을 새 형태로 바꾸기

`map()`은 배열의 모든 항목을 변환한 **새 배열**을 반환해. 원본 배열은 바뀌지 않아.

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(number => number * 2);

console.log(doubled); // [2, 4, 6]
```

### 오늘 프로젝트에서의 활용: 게시글 링크 반복 렌더링

고른 게시글 경로를 하나씩 링크 요소로 바꾸어 목록을 만들었어.

```jsx
{categoryPosts.map(path => (
  <a key={path} href={`/posts/${path}`}>
    게시글 보기
  </a>
))}
```

`categoryPosts`의 각 항목이 JSX 링크 하나로 바뀌고, React는 그 배열을 화면에 반복해서 렌더링해.

## reduce(): 여러 값을 하나로 누적하기

`reduce()`는 배열을 순회하면서 값을 누적해 **하나의 결과값**을 반환해. 숫자 합계, 객체 만들기, 그룹화에 자주 사용해.

```js
const numbers = [1, 2, 3, 4];
const total = numbers.reduce((sum, number) => sum + number, 0);

console.log(total); // 10
```

여기서 `0`은 처음 누적값이고, `sum`은 반복될수록 합계가 돼. 오늘 프로젝트 구현에는 `reduce()`를 직접 사용하지 않았지만, 나중에 카테고리별 게시글 수를 하나의 객체로 만들 때 활용할 수 있어.

```js
const counts = ['javascript', 'react', 'javascript'].reduce(
  (result, category) => {
    result[category] = (result[category] ?? 0) + 1;
    return result;
  },
  {}
);

console.log(counts); // { javascript: 2, react: 1 }
```

## 차이 한눈에 보기

| 메서드 | 하는 일 | 반환값 |
| --- | --- | --- |
| `filter()` | 조건에 맞는 항목만 고름 | 새 배열 |
| `map()` | 모든 항목을 변환함 | 새 배열 |
| `reduce()` | 값을 차례로 누적함 | 하나의 값(숫자, 객체, 배열 등) |
