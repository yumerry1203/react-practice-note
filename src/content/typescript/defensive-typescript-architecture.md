---
title: "TypeScript로 방어적 아키텍처 만들기"
description: "타입, 타입 가드, 템플릿 리터럴 타입을 조합해 외부 설정 데이터를 안전하게 처리하는 방식 처리하기."
date: "2026-09-30"
tags:
  - Type Guard
  - Template Literal Types
  - Defensive Programming
---

# TypeScript로 방어적 아키텍처 만들기

TypeScript는 실행 전에 데이터의 형태와 잘못된 접근을 확인할 수 있게 한다. 특히 외부 API처럼 신뢰할 수 없는 데이터를 다룰 때 타입과 검증 로직을 함께 사용하면 안정적인 흐름을 만들 수 있다.

## 1. TypeScript가 필요한 이유

- 존재하지 않는 프로퍼티 접근이나 오타를 컴파일 단계에서 확인할 수 있다.
- 타입 정보가 코드 수정에 영향을 받는 위치를 알려주므로 리팩터링 범위를 확인하기 쉽다.
- 외부 API 데이터는 타입 가드로 검증한 뒤 내부에 전달할 수 있다.
- 타입 정의는 컴포넌트와 함수의 입력·출력 형태를 보여주는 문서 역할을 한다.
- 타입 정보는 코드 분석과 자동화 도구가 코드를 이해하는 데 도움이 된다.


## 2. 설정 데이터의 타입 정의

템플릿 리터럴 타입으로 문자열이 따라야 할 형식을 정할 수 있다.

```ts
interface SystemConfig {
  mode: 'production' | 'development';
  version: `v${number}.${number}`;
}

const config: SystemConfig = {
  mode: 'production',
  version: 'v1.0',
};
```

`mode`는 두 값만 허용한다. `version`은 `v1.0`처럼 `v`로 시작하고 숫자.숫자 형식을 가진 문자열만 허용한다.

## 3. Type Guard로 외부 데이터 검증하기

외부에서 받은 데이터는 검증 전까지 `unknown`으로 다룬다. 타입 가드는 조건을 통과한 데이터가 `SystemConfig`라는 사실을 TypeScript에 알려준다.

```ts
function isValidConfig(config: unknown): config is SystemConfig {
  if (typeof config !== 'object' || config === null) {
    return false;
  }

  if (!('mode' in config) || !('version' in config)) {
    return false;
  }

  return (
    (config.mode === 'production' || config.mode === 'development') &&
    typeof config.version === 'string' &&
    /^v\d+\.\d+$/.test(config.version)
  );
}
```

객체인지, 필요한 속성이 있는지, 각 값의 형식이 맞는지 순서대로 확인한다. 검증이 성공한 뒤에는 `config.mode`와 `config.version`을 안전하게 사용할 수 있다.

## 4. 검증 결과에 따라 화면 나누기

```tsx
function BootSystem({ rawConfig }: { rawConfig: unknown }) {
  if (!isValidConfig(rawConfig)) {
    return <p>설정 데이터 규격이 맞지 않아 시스템을 시작할 수 없다.</p>;
  }

  return (
    <section>
      <h1>시스템 모드: {rawConfig.mode.toUpperCase()}</h1>
      <p>현재 버전: {rawConfig.version}</p>
    </section>
  );
}
```

잘못된 데이터는 하위 컴포넌트에 전달하기 전에 안내 화면으로 처리한다. 검증된 데이터만 정상 화면에 전달하므로 `toUpperCase()` 같은 문자열 메서드도 안전하게 사용할 수 있다.

## 정리

- 타입은 데이터와 함수가 따라야 할 규격을 명확하게 만든다.
- 템플릿 리터럴 타입은 특정 문자열 패턴을 컴파일 단계에서 제한한다.
- 타입 가드는 `unknown` 데이터를 검증한 뒤 안전한 타입으로 좁힌다.
- 검증 실패를 별도 화면으로 처리하면 잘못된 데이터로 인한 오류 확산을 줄일 수 있다.
