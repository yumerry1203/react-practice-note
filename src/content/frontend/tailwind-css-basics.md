---
title: "Tailwind CSS 기본 가이드"
description: "Vite와 React 프로젝트에 Tailwind CSS 4를 연결하고 유틸리티 클래스와 디자인 토큰을 사용하는 방법"
date: "2026-10-03"
tags:
  - Tailwind CSS
  - Design Token
---

# Tailwind CSS 기본 가이드

Vite, React, TypeScript 프로젝트에 Tailwind CSS 4를 설치하고 전역 CSS, 유틸리티 클래스, 디자인 토큰을 사용하는 방법.

## 1. 설치

Vite와 React, TypeScript 프로젝트에서 Tailwind CSS 4와 Vite 플러그인을 설치한다.

```bash
npm install tailwindcss @tailwindcss/vite
```

## 2. Vite 연결

`vite.config.ts`에 Tailwind 플러그인을 추가한다.

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## 3. 전역 CSS 적용

`src/index.css` 맨 위에서 Tailwind 패키지를 불러온다.

```css
@import "tailwindcss";
```

`@import "tailwind.css";`는 프로젝트에 해당 파일이 없으면 오류가 난다. Tailwind CSS 4에서는 파일 경로 대신 아래처럼 패키지 이름을 사용한다.

```css
@import "tailwindcss";
```

## 4. Tailwind 클래스 사용

JSX의 `className`에 유틸리티 클래스를 작성한다.

```tsx
function App() {
  return (
    <main className="grid min-h-screen place-items-center">
      <h1 className="text-3xl font-bold">Hello Tailwind CSS</h1>
    </main>
  )
}
```

## 5. 디자인 토큰 설정

`src/index.css`에서 `@import "tailwindcss";` 바로 아래에 `@theme`을 선언한다.

```css
@theme {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-secondary: #64748b;
  --color-text: #111827;
  --color-border: #e5e7eb;
}
```

`--color-이름` 형식으로 선언하면 해당 이름을 사용하는 Tailwind 클래스를 만들 수 있다.

```tsx
<button className="bg-primary text-white hover:bg-primary-hover">
  저장
</button>

<p className="text-text">본문</p>
<div className="border border-border">카드</div>
```

`secondary`는 대표 색상보다 우선순위가 낮은 보조 요소에 사용한다. 예를 들어 보조 버튼, 아이콘, 상태를 강조하지 않아도 되는 안내 요소에 적용할 수 있다.

```tsx
<button className="bg-secondary text-white">
  취소
</button>
```

## 6. 토큰 역할 예시

| 토큰 | 역할 | 활용 예시 | Tailwind 클래스 예시 |
| --- | --- | --- | --- |
| `primary` | 서비스 대표 색상 | 주요 버튼, 활성 메뉴 | `bg-primary`, `text-primary` |
| `primary-hover` | 대표 색상의 hover 상태 | 주요 버튼 hover | `hover:bg-primary-hover` |
| `secondary` | 보조 색상 | 보조 버튼, 아이콘 | `bg-secondary` |
| `success` | 성공·긍정 상태 | 완료 알림, 수입 | `text-success` |
| `danger` | 위험·오류 상태 | 삭제, 오류, 지출 | `text-danger` |
| `background` | 페이지 기본 배경 | 앱 전체 배경 | `bg-background` |
| `surface` | 콘텐츠 표면 배경 | 카드, 모달, 테이블 | `bg-surface` |
| `text` | 기본 글자색 | 제목, 본문 | `text-text` |
| `text-muted` | 보조 글자색 | 설명, 날짜, 안내 문구 | `text-text-muted` |
| `border` | 테두리·구분선 | 입력창, 카드, 테이블 | `border-border` |

## 7. 크기 사용 원칙

실무에서는 일반적으로 브라우저 기본값인 `1rem = 16px`을 유지한다. `html { font-size: 62.5%; }`로 `1rem = 10px`로 바꾸면 Tailwind의 기본 글자 크기와 간격도 함께 작아진다.

반복되는 글자 크기는 토큰으로 관리한다.

```css
@theme {
  --text-page-title: 2rem;
  --text-section-title: 1.5rem;
  --text-body: 1rem;
  --text-caption: 0.875rem;
}
```

```tsx
<h1 className="text-page-title font-bold">페이지 제목</h1>
<p className="text-body">본문</p>
```

한 번만 필요한 정확한 크기는 임의 값 문법을 사용한다.

```tsx
<h1 className="text-[20px] font-bold">제목</h1>
```

## 정리

- Tailwind CSS 4는 `tailwindcss`와 `@tailwindcss/vite`를 설치해 Vite에 연결한다.
- 전역 CSS에서는 `@import "tailwindcss";`로 패키지를 불러온다.
- 유틸리티 클래스는 JSX `className`에서 사용한다.
- 반복되는 색상과 글자 크기는 `@theme` 토큰으로 관리한다.
- 한 번만 필요한 크기는 임의 값 문법을 사용한다.
