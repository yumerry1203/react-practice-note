---
title: "JavaScript 연산자와 조건 처리"
description: "산술·비교·논리 연산자와 if, 삼항 연산자, nullish 병합 연산자의 핵심 동작"
date: "Last Updated · 2026.10.06"
tags:
  - Operator
  - Condition
  - Nullish Coalescing
---

# JavaScript 연산자와 조건 처리

값을 계산하고 비교한 뒤, 조건에 따라 다른 결과를 만들 때 사용하는 기본 문법을 정리했다. 연산자는 결과를 반환하고, 그 결과를 조건문이나 변수에 다시 사용할 수 있다.

## 1. 산술과 할당 연산자

산술 연산자는 숫자를 계산할 때 사용한다. `+`는 숫자 덧셈뿐 아니라 문자열 연결에도 사용되므로 값의 타입을 함께 확인해야 한다.

| 연산자 | 역할 | 예시 |
| --- | --- | --- |
| `+` | 덧셈 또는 문자열 연결 | `10 + 5`, `"Hi " + "JS"` |
| `-`, `*`, `/` | 뺄셈, 곱셈, 나눗셈 | `10 - 5`, `10 * 5`, `10 / 5` |
| `%` | 나머지 | `10 % 3` |
| `**` | 거듭제곱 | `2 ** 3` |
| `=` | 값 할당 | `let total = 0` |
| `+=`, `-=`, `*=` | 계산 후 다시 할당 | `total += 1` |

```js
let amount = 10;

amount += 5;
const remainder = amount % 4;

// amount: 15, remainder: 3
```

## 2. 비교 연산자와 불린값

비교 연산자는 두 값을 비교해 `true` 또는 `false`를 반환한다. 이 반환값은 `if` 조건이나 변수에 그대로 사용할 수 있다.

| 연산자 | 의미 |
| --- | --- |
| `>` , `<` | 크다, 작다 |
| `>=`, `<=` | 크거나 같다, 작거나 같다 |
| `==`, `!=` | 타입 변환을 허용하는 동등·부등 비교 |
| `===`, `!==` | 타입까지 확인하는 일치·불일치 비교 |

```js
const score = 85;
const isPassed = score >= 60;

console.log(isPassed); // true
console.log(0 === false); // false
console.log(0 == false); // true
```

`==`는 서로 다른 타입을 변환한 뒤 비교하기 때문에 예상하지 못한 결과를 만들 수 있다. 값과 타입을 함께 비교해야 하는 일반적인 상황에서는 `===`, `!==`를 사용한다.

## 3. 문자열과 다른 타입 비교

문자열은 앞 글자부터 유니코드 순서로 비교한다. 대문자와 소문자는 서로 다른 순서를 가지므로 비교 결과가 직관과 다를 수 있다.

```js
console.log('Glow' > 'Glee'); // true
console.log('a' > 'Z'); // true
```

비교하는 두 값의 타입이 다르면 `==`와 크기 비교 연산자는 값의 타입을 변환할 수 있다.

```js
console.log('2' > 1); // true
console.log(true == 1); // true
```

이런 자동 변환을 피하려면 입력값의 타입을 먼저 맞추고, 비교에는 `===`를 사용한다.

## 4. null과 undefined 비교

`null`과 `undefined`는 값이 없다는 상태를 표현하지만 동작 방식이 같다. 특히 비교 연산자와 함께 사용할 때는 자동 변환 규칙을 주의해야 한다.

```js
console.log(null === undefined); // false
console.log(null == undefined); // true

console.log(null >= 0); // true
console.log(null == 0); // false
console.log(undefined > 0); // false
```

`null`, `undefined`와 숫자 비교를 섞으면 읽기 어려운 결과가 나올 수 있다. 값의 유무를 확인할 때는 비교 연산자보다 명확한 조건이나 `??`를 사용한다.

## 5. 논리 연산자와 truthy, falsy

논리 연산자는 조건을 연결하거나 반전할 때 사용한다. 자바스크립트에서는 `false`뿐 아니라 `0`, 빈 문자열, `null`, `undefined`, `NaN`도 falsy 값으로 처리한다. 나머지 값은 truthy 값이다.

| 연산자 | 역할 |
| --- | --- |
| `||` | 왼쪽이 falsy이면 오른쪽 값을 사용 |
| `&&` | 왼쪽이 truthy일 때 오른쪽 값을 평가 |
| `!` | 불린값을 반전 |

```js
const hasCoupon = true;
const isMember = false;

console.log(hasCoupon && isMember); // false
console.log(!isMember); // true
console.log('' || '기본 제목'); // "기본 제목"
```

`||`는 `0`이나 빈 문자열도 값이 없는 것처럼 처리한다. 이 값들을 유효한 값으로 유지해야 한다면 `??`를 사용한다.

## 6. if와 삼항 연산자

`if`는 조건에 따라 실행할 코드 블록을 나눌 때 사용한다. 분기가 길거나 여러 동작을 실행해야 한다면 `if...else`가 읽기 쉽다.

```js
const age = 20;

if (age >= 19) {
  console.log('성인입니다.');
} else {
  console.log('미성년자입니다.');
}
```

삼항 연산자 `? :`는 조건에 따라 하나의 값을 선택해 반환할 때 사용한다.

```js
const message = age >= 19 ? '성인' : '미성년자';
```

여러 동작을 실행하거나 조건이 여러 단계로 길어지면 삼항 연산자 대신 `if...else if`를 사용한다.

## 7. nullish 병합 연산자 ??

`??`는 왼쪽 값이 `null` 또는 `undefined`일 때만 오른쪽 기본값을 사용한다.

```js
const height = 0;
const defaultHeight = height ?? 100;

console.log(defaultHeight); // 0
console.log(height || 100); // 100
```

`||`는 첫 번째 truthy 값을 선택하고, `??`는 첫 번째로 정의된 값을 선택한다. 숫자 `0`이나 빈 문자열을 유효한 값으로 유지해야 할 때 `??`가 적합하다.

`??`는 괄호 없이 `&&`, `||`와 함께 사용할 수 없다. 함께 사용해야 한다면 의도를 드러내기 위해 괄호를 추가한다.

```js
const result = (1 && 2) ?? 3;
```

## 정리

- 산술 연산자는 값을 계산하고, 비교 연산자는 `true` 또는 `false`를 반환한다.
- 일반적인 값 비교에는 자동 형 변환을 피할 수 있는 `===`, `!==`를 사용한다.
- `if`는 실행 흐름을 나누고, 삼항 연산자는 짧게 값을 선택할 때 사용한다.
- `||`는 falsy 값을 기본값으로 바꾸고, `??`는 `null`과 `undefined`일 때만 기본값을 사용한다.
- `null`, `undefined`를 숫자와 비교하는 코드는 결과가 혼란스러울 수 있으므로 피한다.
