# this란?

JavaScript에서 `this`는 현재 실행 컨텍스트에서
참조하는 객체를 의미합니다.

## 객체 메서드에서 this

```js
const user = {
  name: "유형",

  sayHello() {
    console.log(this.name);
  }
};

user.sayHello();