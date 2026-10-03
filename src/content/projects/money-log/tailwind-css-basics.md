---
title: "MoneyLog에 Tailwind CSS와 디자인 토큰 적용하기"
description: "MoneyLog의 수입·지출 상태와 화면 요소를 일관되게 표현하기 위한 Tailwind CSS 색상 토큰 적용 기준을 정했다.."
date: "2026-10-03"
tags:
  - Tailwind CSS
  - Design Token
  - UI Design
---

# MoneyLog에 Tailwind CSS와 디자인 토큰 적용하기

MoneyLog 프로젝트에서 Tailwind CSS를 연결하고, 필요한 색상 토큰들을 적용했다.  
메인컬러로는 그린 `#2e7d5b` , 서브컬러로는 연핑크 `f3b6c8` 로 정했다.

## 1. Tailwind 연결

MoneyLog 프로젝트의 `vite.config.ts`에 Tailwind 플러그인을 등록한다.

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

`src/index.css` 최상단에는 Tailwind를 불러온다.

```css
@import "tailwindcss";
```

## 2. MoneyLog 색상 토큰

`src/index.css`의 `@import "tailwindcss";` 바로 아래에 다음 토큰을 선언한다.

```css
@theme {
  /* Brand */
  --color-primary: #2e7d5b;
  --color-primary-hover: #25684b;
  --color-primary-light: #e8f3ee;

  /* Expense / Secondary */
  --color-secondary: #f3b6c8;
  --color-secondary-hover: #eaa3b8;
  --color-secondary-light: #fceef3;

  /* Income */
  --color-income: #7cc7f2;
  --color-income-hover: #58b5ea;
  --color-income-light: #eaf7fe;

  /* Status */
  --color-success: #22c55e;
  --color-danger: #dc2626;

  /* Base */
  --color-background: #ffffff;
  --color-surface: #f8faf9;

  /* Text */
  --color-text: #111827;
  --color-text-muted: #6b7280;

  /* Border */
  --color-border: #e5e7eb;
}
```


## 3. 화면별 사용 예시

### 주요 거래 등록 버튼

```tsx
<button className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover">
  거래 등록
</button>
```

### 지출 금액과 태그

```tsx
<div className="bg-secondary-light text-secondary">
  지출
</div>

<p className="text-secondary">-12,000원</p>
```

### 수입 금액과 태그

```tsx
<div className="bg-income-light text-income">
  수입
</div>

<p className="text-income">+3,000,000원</p>
```

### 기본 카드

```tsx
<section className="rounded-xl border border-border bg-surface p-6">
  <h2 className="text-text">이번 달 총 지출</h2>
  <p className="text-text-muted">지난달보다 12% 감소했다.</p>
</section>
```

### 삭제 버튼

```tsx
<button className="text-danger">
  삭제
</button>
```

## 5. 적용 원칙

- 화면에 색상값을 직접 쓰기보다 `bg-primary`, `text-income`처럼 토큰 기반 클래스를 우선 사용한다.
- 지출은 `secondary`, 수입은 `income` 토큰을 사용해 의미를 명확히 구분한다.
- 카드와 모달은 `surface`, 페이지 전체는 `background`를 사용한다.
- 설명과 날짜는 `text-muted`, 일반 본문과 제목은 `text`를 사용한다.
- 삭제와 오류 상태에만 `danger`를 사용한다.

## 정리

- Tailwind는 Vite 플러그인과 전역 CSS import로 연결한다.
- MoneyLog의 대표색은 `primary`, 지출은 `secondary`으로 구분한다.
- 색상값을 직접 반복하지 않고 토큰으로 관리해 화면의 의미와 스타일을 통일한다.
