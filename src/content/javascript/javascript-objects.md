---
title: "JavaScript에서의 객체"
description: "객체의 메서드와 this, 참조 복사, 옵셔널 체이닝의 동작 방식"
date: "Last Updated · 2026.09.30"
tags:
  - Object
  - Method
  - this
  - Reference
  - Optional Chaining
---

# JavaScript에서의 객체


## 1. 객체와 메서드

객체 프로퍼티에 함수를 할당하면 객체가 실행할 수 있는 동작이 된다. 이렇게 객체에 할당된 함수를 **메서드**라고 한다.

```js
const member = {
  name: 'Mina',
  points: 42,
};

member.showGreeting = function () {
  alert('반갑습니다!');
};

member.showGreeting();
```

이미 선언한 함수를 메서드로 할당할 수도 있다.

```js
function showGreeting() {
  alert('반갑습니다!');
}

member.showGreeting = showGreeting;
```

객체 리터럴 안에서는 `function`을 생략한 메서드 단축 구문을 자주 사용한다.

```js
const member = {
  showGreeting() {
    alert('Welcome');
  },
};
```

## 2. 메서드와 `this`

메서드는 객체에 저장된 값을 사용해야 할 때가 많다. 메서드 안의 `this`는 메서드를 호출한 객체를 가리킨다.

```js
const profile = {
  name: 'Mina',

  introduce() {
    alert(this.name);
  },
};

profile.introduce(); // Mina
```

`this`의 값은 런타임에 결정된다. 같은 함수를 서로 다른 객체의 메서드로 호출하면 호출한 객체에 따라 `this`도 달라진다.

```js
function printName() {
  alert(this.name);
}

const account = { name: 'Jisoo', printName };
const operator = { name: 'Manager', printName };

account.printName(); // Jisoo
operator.printName(); // Manager
```


## 3. 화살표 함수와 `this`

화살표 함수는 자신만의 `this`를 만들지 않는다. 화살표 함수 안에서 `this`를 사용하면 바깥 일반 함수의 `this`를 가져온다.

```js
const reader = {
  firstName: '하린',
  showFirstName() {
    const readName = () => alert(this.firstName);
    readName();
  },
};

reader.showFirstName(); // 하린
```

메서드 안에서 바깥 객체의 `this`를 그대로 사용해야 할 때 화살표 함수가 유용하다.

## 4. 참조에 의한 객체 복사

문자열, 숫자 같은 원시값은 값 자체가 복사된다. 객체를 변수에 할당하거나 복사하면 객체 자체가 아닌 같은 객체를 가리키는 **참조 값**이 복사된다.

```js
const customer = { name: 'Mina' };
const manager = customer;

manager.name = 'Rina';

alert(customer.name); // Rina
```

`customer`와 `manager`는 같은 객체를 가리킨다. 따라서 한 변수로 프로퍼티를 바꾸면 다른 변수에서도 변경된 값을 확인할 수 있다.

객체 비교는 같은 객체를 참조할 때만 `true`가 된다.

```js
const a = {};
const b = a;
const c = {};

alert(a === b); // true
alert(a === c); // false
```

## 5. 객체 복사와 병합

독립된 객체가 필요하면 새 객체에 프로퍼티를 복사해야 한다. `Object.assign()`은 여러 객체의 프로퍼티를 목표 객체에 복사한다.

```js
const settings = { theme: 'light', fontSize: 16 };
const copiedSettings = Object.assign({}, settings);

copiedSettings.theme = 'dark';

alert(settings.theme); // light
```

같은 이름의 프로퍼티가 있으면 뒤에 전달한 값으로 덮어쓴다.

```js
const profile = { name: 'Mina' };

Object.assign(profile, { name: 'Yuna' });

alert(profile.name); // Yuna
```

`Object.assign()`은 중첩 객체까지 독립적으로 복사하지 않는다. 중첩 객체도 복사해야 하는 경우에는 깊은 복사가 필요하다.

## 6. 옵셔널 체이닝 `?.`

옵셔널 체이닝은 왼쪽 값이 `null` 또는 `undefined`이면 평가를 멈추고 `undefined`를 반환한다. 존재하지 않을 수 있는 중첩 프로퍼티에 접근할 때 사용한다.

```js
const visitor = {};

alert(visitor.address?.street); // undefined
```

함수 호출과 대괄호 접근에도 사용할 수 있다.

```js
const owner = {
  showRole() {
    alert('운영자 계정입니다.');
  },
};
const guest = {};

owner.showRole?.();
guest.showRole?.();

const key = 'nickname';
alert(owner?.[key]);
```

`?.` 앞의 변수는 이미 선언되어 있어야 한다. 또한 반드시 존재해야 하는 값까지 옵셔널 체이닝으로 처리하면 오류를 늦게 발견할 수 있으므로, 없어도 괜찮은 대상에만 사용한다.

옵셔널 체이닝은 읽기와 삭제에는 사용할 수 있지만 할당의 왼쪽에는 사용할 수 없다.

```js
delete visitor?.name;

// visitor?.name = 'Yuna'; // SyntaxError
```

## 정리

- 객체 프로퍼티에 저장한 함수를 메서드라고 하며, 메서드는 `this`로 호출한 객체에 접근한다.
- 객체를 복사하면 참조 값이 복사되므로 여러 변수가 같은 객체를 가리킬 수 있다.
- `Object.assign()`은 얕은 복사를 수행하며 중첩 객체는 공유될 수 있다.
- 옵셔널 체이닝은 없어도 괜찮은 값에 안전하게 접근할 때 사용한다.
