# 스코프란?

스코프(Scope)는 변수에 접근할 수 있는 범위를 의미합니다.

## 전역 스코프

함수나 블록 바깥에서 선언된 변수는 전역에서 접근할 수 있습니다.

```js
const name = "유형";

function sayHello() {
  console.log(name);
}

sayHello();