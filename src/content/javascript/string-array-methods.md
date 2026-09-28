---
title: "pop(), replace(), split() 정리"
description: "배열의 마지막 값을 꺼내고 문자열을 나누거나 바꾸는 메서드로 파일 경로에서 slug 만들기"
date: 2026-09-28
tags: [JavaScript, Array, String, pop, replace, split, slug]
---

# pop(), replace(), split() 정리

파일 경로처럼 긴 문자열에서 필요한 이름만 뽑아내려면 문자열을 나누고, 마지막 조각을 꺼내고, 필요 없는 확장자를 제거하면 돼. 오늘 프로젝트에서는 `split()`, `pop()`, `replace()`를 이어서 써서 Markdown 파일 경로를 slug로 바꿨어.

## split(): 문자열을 나누어 배열로 만들기

`split()`은 문자열을 기준 문자로 나누어 **새 배열**을 반환해. 원본 문자열은 바뀌지 않아.

```js
const path = '../content/javascript/scope.md';
const parts = path.split('/');

console.log(parts);
// ['..', 'content', 'javascript', 'scope.md']
```

## pop(): 배열의 마지막 값을 꺼내기

`pop()`은 배열의 마지막 항목을 제거하면서 그 값을 반환해. **원본 배열이 바뀌어.**

```js
const fruits = ['apple', 'banana', 'orange'];
const lastFruit = fruits.pop();

console.log(lastFruit); // 'orange'
console.log(fruits); // ['apple', 'banana']
```

경로를 `/`로 나누었다면 마지막 항목은 파일명이야.

```js
const parts = ['..', 'content', 'javascript', 'scope.md'];
const fileName = parts.pop();

console.log(fileName); // 'scope.md'
```

## replace(): 문자열 일부를 바꾸기

`replace()`는 찾은 문자열을 다른 문자열로 바꾼 **새 문자열**을 반환해. 원본 문자열은 바뀌지 않아.

```js
const fileName = 'scope.md';
const slug = fileName.replace('.md', '');

console.log(slug); // 'scope'
console.log(fileName); // 'scope.md'
```

참고로 일반적인 `replace()`는 기본적으로 첫 번째로 찾은 부분만 바꿔. 여러 곳을 모두 바꾸려면 `replaceAll()` 또는 정규식을 사용할 수 있어.

## 오늘 프로젝트 활용: 경로에서 slug 만들기

아래 코드는 Markdown 경로를 게시글 주소에 쓸 slug로 바꿔.

```js
const path = '../content/javascript/scope.md';
const slug = path.split('/').pop()?.replace('.md', '');

console.log(slug); // 'scope'
```

### 단계별 흐름

1. `path.split('/')`

   ```js
   ['..', 'content', 'javascript', 'scope.md']
   ```

2. `.pop()`이 마지막 요소를 꺼내.

   ```js
   'scope.md'
   ```

3. `?.replace('.md', '')`가 확장자를 지워.

   ```js
   'scope'
   ```

여기서 `?.`는 optional chaining이야. `pop()` 결과가 없어서 `undefined`인 경우에도 오류 없이 `undefined`를 반환하게 해줘.

## 차이 한눈에 보기

| 메서드 | 대상 | 반환값 | 원본 변경 |
| --- | --- | --- | --- |
| `split()` | 문자열 | 새 배열 | 없음 |
| `pop()` | 배열 | 제거한 마지막 요소 | 있음 |
| `replace()` | 문자열 | 바뀐 새 문자열 | 없음 |

