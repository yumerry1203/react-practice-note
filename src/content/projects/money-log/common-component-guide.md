---
title: "3-1. 공통 컴포넌트 가이드 화면 구현"
description: "MoneyLog의 공통 폼 컴포넌트를 상태별로 확인할 수 있는 디자인 가이드 화면을 만들었다."
date: "2026-10-13"
tags:
  - MoneyLog
  - Design System
  - UI Component
  - Tailwind CSS
---

# 3-1. 공통 컴포넌트 가이드 화면 구현

MoneyLog에서 사용할 공통 입력 컴포넌트를 만들고, 각 상태를 한 화면에서 확인할 수 있는 디자인 가이드 화면을 구현했다.

## 1. 공통 컴포넌트 구성

폼에서 반복해서 사용하는 컴포넌트를 분리했다.

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- DatePicker

공통 컴포넌트는 화면마다 같은 구조와 스타일을 유지할 수 있도록 만들었다.

```tsx
import { Button, Input, Select } from './components/common';

<Button>등록하기</Button>

<Input label="금액" placeholder="금액을 입력하세요." />

<Select label="카테고리" options={categories} />
```

필요한 컴포넌트만 가져와 사용할 수 있도록 공통 export 파일도 추가했다.

## 2. 상태별 스타일 적용

입력 컴포넌트는 기본, 포커스, 입력됨, 오류, 비활성 상태를 제공한다.

```tsx
<Input label="금액" placeholder="금액을 입력하세요." />

<Input defaultValue="48,000원" label="금액" />

<Input defaultValue="abc" error="숫자만 입력해주세요." label="금액" />

<Input defaultValue="48,000원" disabled label="금액" />
```

포커스 상태에서는 `primary`와 `primary-light` 토큰을 사용해 현재 입력 위치를 표시했다. 오류 상태에서는 `danger` 토큰과 안내 문구를 함께 표시했다. 비활성 상태에서는 `surface` 배경과 `text-muted` 텍스트를 사용했다.

## 3. 버튼 variant 구성

Button은 용도에 따라 네 가지 variant를 제공한다.

```tsx
<Button>등록하기</Button>

<Button variant="secondary">지출하기</Button>

<Button variant="income">수입하기</Button>

<Button variant="ghost">취소하기</Button>
```

- `primary`는 주요 등록 버튼에 사용한다.
- `secondary`는 지출 관련 버튼에 사용한다.
- `income`은 수입 관련 버튼에 사용한다.
- `ghost`는 취소와 보조 동작에 사용한다.

지출 버튼은 `danger` 토큰의 빨간 텍스트를 적용했다. 수입 버튼은 더 선명한 파랑을 표현하기 위해 `income-text` 토큰을 추가해 적용했다.

```css
--color-income-text: #1687c9;
```

## 4. 디자인 가이드 화면 추가

Header 우측에 작은 `디자인 가이드` 버튼을 추가했다. 버튼을 클릭하면 공통 컴포넌트 가이드 화면으로 이동한다.

가이드 화면에서는 다음 항목을 확인할 수 있다.

- 버튼의 기본, hover, 비활성 상태
- Input과 Textarea의 기본, 입력됨, 오류, 비활성 상태
- Select Box의 기본, 선택됨, 비활성 상태
- Checkbox와 Radio Box의 기본, 선택됨, 비활성 상태
- Datepicker의 기본, 선택됨, 오류, 비활성 상태

입력 필드를 클릭하면 실제 focus 상태를 확인할 수 있고, 버튼에 마우스를 올리면 hover 상태를 확인할 수 있다.

## 5. 적용 원칙

공통 컴포넌트에는 MoneyLog 디자인 토큰만 사용했다.

- 주요 동작에는 `primary`
- 지출 관련 요소에는 `secondary`, `danger`
- 수입 관련 요소에는 `income`, `income-text`
- 카드와 비활성 배경에는 `surface`
- 기본 텍스트에는 `text`
- 보조 텍스트에는 `text-muted`
- 경계선에는 `border`

## 정리

- 반복되는 폼 요소를 공통 컴포넌트로 분리했다.
- 기본, 포커스, 오류, 비활성 상태를 컴포넌트 props로 처리했다.
- Header에서 디자인 가이드 화면으로 이동할 수 있게 만들었다.
- 수입 버튼에는 선명한 파랑 텍스트 토큰을 추가했다.
