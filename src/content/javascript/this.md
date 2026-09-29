---
title: "JavaScript this와 객체 메서드"
description: "객체 메서드에서 this가 현재 객체를 참조하는 방식을 정리한다."
date: "2026-09-29"
tags:
  - JavaScript
  - this
  - Object
  - Method
---

# JavaScript this와 객체 메서드

JavaScript에서 `this`는 현재 실행 컨텍스트에서
참조하는 객체를 의미한다.

## 1. 객체 메서드에서 this

```js
const user = {
  name: "유형",

  sayHello() {
    console.log(this.name);
  }
};

user.sayHello();
```

`sayHello()`를 `user`의 메서드로 호출하면 메서드 내부의 `this`는 `user` 객체를 참조한다. 따라서 `this.name`은 `"유형"`을 출력한다.

## 정리

- `this`는 현재 실행 컨텍스트에서 참조하는 객체를 가리킨다.
- 객체의 메서드로 호출한 함수 안에서는 `this`로 해당 객체의 프로퍼티에 접근할 수 있다.
