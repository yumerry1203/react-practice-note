---
title: "Object.keys(), Object.values(), Object.entries() 정리"
description: "객체의 키, 값, 키-값 쌍을 배열로 꺼내는 세 가지 Object 메서드와 게시글 수를 세는 활용법"
date: 2026-09-28
tags: [JavaScript, Object, Object.keys, Object.values, Object.entries, Markdown]
---

# Object.keys(), Object.values(), Object.entries() 정리

객체는 `키: 값` 형태로 데이터를 보관해. 객체 안의 데이터를 반복해서 확인하거나 화면에 보여 주려면, 키·값·키와 값의 쌍을 배열로 꺼내는 일이 많아. 이때 사용하는 메서드가 `Object.keys()`, `Object.values()`, `Object.entries()`야.

## 예제 객체

```js
const user = {
  name: '민지',
  age: 25,
  job: 'frontend developer',
};
```

## Object.keys(): 키만 배열로 반환

`Object.keys()`는 객체의 **키 이름만** 배열로 돌려줘.

```js
Object.keys(user);
// ['name', 'age', 'job']
```

키의 개수가 필요할 때는 배열의 `length`를 붙이면 돼.

```js
Object.keys(user).length;
// 3
```

### 오늘 프로젝트에서의 활용: Markdown 게시글 수 세기

오늘 프로젝트의 `posts` 객체에는 Markdown 파일 경로가 키로 들어 있어. 그래서 아래처럼 키 목록을 만든 뒤 길이를 확인하면 전체 게시글 수를 셀 수 있어.

```js
const postCount = Object.keys(posts).length;
```

예를 들어 `posts`에 게시글 경로가 4개라면 `postCount`는 `4`야.

## Object.values(): 값만 배열로 반환

`Object.values()`는 객체의 **값만** 배열로 돌려줘.

```js
Object.values(user);
// ['민지', 25, 'frontend developer']
```

값만 화면에 나열하거나 값들을 계산할 때 유용해.

```js
const scores = { korean: 90, math: 85, english: 95 };

Object.values(scores);
// [90, 85, 95]
```

## Object.entries(): 키와 값을 함께 배열로 반환

`Object.entries()`는 `[키, 값]` 형태의 배열들을 반환해.

```js
Object.entries(user);
// [['name', '민지'], ['age', 25], ['job', 'frontend developer']]
```

키와 값을 함께 써야 한다면 반복문에서 특히 편리해.

```js
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
// name: 민지
// age: 25
// job: frontend developer
```

## 차이 한눈에 보기

| 메서드 | 반환값 | 예시 |
| --- | --- | --- |
| `Object.keys(obj)` | 키 배열 | `['name', 'age']` |
| `Object.values(obj)` | 값 배열 | `['민지', 25]` |
| `Object.entries(obj)` | `[키, 값]` 배열 | `[['name', '민지'], ['age', 25]]` |
