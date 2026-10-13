---
title: "JavaScript 반복문: while과 for"
description: "while, do...while, for 반복문의 동작 방식과 break, continue, 레이블을 이용한 흐름 제어를 정리했다."
date: "Last Updated · 2026.10.13"
tags:
  - JavaScript
  - Loop
  - Control Flow
---

# JavaScript 반복문: while과 for

반복문은 같은 동작을 여러 번 실행할 때 사용한다. 목록을 순서대로 처리하거나, 특정 조건이 만족될 때까지 값을 계산하는 상황에서 활용한다.

## 1. while 반복문

`while`은 반복을 시작하기 전에 조건을 확인한다. 조건이 truthy인 동안 본문을 반복해서 실행한다.

```js
let index = 0;

while (index < 3) {
  console.log(index);
  index += 1;
}
```

반복 조건을 바꾸는 코드가 없으면 무한 반복이 될 수 있다. 아래처럼 숫자 자체를 조건으로 쓸 수도 있다. `count`가 `0`이 되면 falsy가 되어 반복이 끝난다.

```js
let count = 3;

while (count) {
  console.log(count);
  count -= 1;
}
```

## 2. do...while 반복문

`do...while`은 본문을 먼저 한 번 실행한 뒤 조건을 확인한다. 조건이 처음부터 false여도 본문은 최소 한 번 실행된다.

```js
let attempt = 0;

do {
  console.log(attempt);
  attempt += 1;
} while (attempt < 3);
```

최소 한 번의 실행이 꼭 필요한 경우에만 사용한다. 대부분의 경우에는 조건을 먼저 확인하는 `while`이나 `for`가 읽기 쉽다.

## 3. for 반복문

`for`는 시작값, 반복 조건, 반복 후 실행할 코드를 한 줄에 모아 작성할 수 있어 가장 자주 사용한다.

```js
for (let index = 0; index < 3; index += 1) {
  console.log(index);
}
```

`for`는 다음 순서로 동작한다.

1. 시작식이 한 번 실행된다.
2. 조건식이 truthy인지 확인한다.
3. 본문을 실행한다.
4. 증감식을 실행한 뒤 다시 조건식으로 돌아간다.

반복문 안에서 `let`으로 선언한 변수는 반복문 밖에서 사용할 수 없다.

```js
for (let index = 0; index < 3; index += 1) {
  console.log(index);
}

// console.log(index); // ReferenceError
```

필요에 따라 시작식이나 증감식은 생략할 수 있다. 다만 세미콜론 두 개는 유지해야 한다.

```js
let index = 0;

for (; index < 3;) {
  console.log(index);
  index += 1;
}
```

## 4. break로 반복문 종료하기

`break`는 조건식과 관계없이 현재 반복문을 즉시 종료한다. 반복 중간에 종료 조건을 확인해야 할 때 사용할 수 있다.

```js
let total = 0;

while (true) {
  const value = Number(prompt('숫자를 입력하세요.', ''));

  if (!value) break;

  total += value;
}

console.log(total);
```

`while (true)`와 `break`를 함께 사용하면 본문 안의 여러 위치에서 반복을 종료할 수 있다.

## 5. continue로 다음 반복으로 넘어가기

`continue`는 현재 반복의 남은 코드를 건너뛰고 다음 반복으로 넘어간다.

```js
for (let number = 0; number < 10; number += 1) {
  if (number % 2 === 0) continue;

  console.log(number); // 1, 3, 5, 7, 9
}
```

위 코드에서는 짝수일 때 `continue`가 실행되므로 홀수만 출력된다. 조건이 맞지 않는 경우를 먼저 건너뛰면 중첩된 `if`를 줄일 수 있다.

`break`와 `continue`는 표현식이 아니라 문법 구조이므로 삼항 연산자 안에서 사용할 수 없다.

```js
// 조건 ? doSomething() : continue; // SyntaxError
```

## 6. 중첩 반복문과 레이블

중첩 반복문에서 일반적인 `break`는 가장 안쪽 반복문만 종료한다. 두 반복문을 모두 종료해야 할 때는 레이블을 사용할 수 있다.

```js
outer: for (let row = 0; row < 3; row += 1) {
  for (let column = 0; column < 3; column += 1) {
    const input = prompt(`(${row}, ${column}) 값`, '');

    if (!input) break outer;
  }
}
```

`break outer`는 `outer` 레이블이 붙은 바깥 반복문까지 종료한다. 레이블은 중첩 반복문을 제어해야 할 때만 제한적으로 사용한다.

## 정리

- `while`은 반복 전에 조건을 확인한다.
- `do...while`은 본문을 최소 한 번 실행한 뒤 조건을 확인한다.
- `for`는 시작식, 조건식, 증감식을 함께 작성할 수 있어 반복 횟수가 명확한 상황에 적합하다.
- `break`는 반복문을 종료하고, `continue`는 현재 반복만 건너뛴다.
- 레이블은 중첩 반복문 전체를 제어해야 할 때 사용할 수 있다.
