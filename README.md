# NAYUHYEONG Frontend Dev Note

프론트엔드 개발 과정에서 학습한 개념과 실무 경험을 다시 정리하고, 구현 및 트러블슈팅 과정을 기록하는 개인 개발 노트이다.

JavaScript, React, TypeScript, 프론트엔드 주제와 기술 동향을 Markdown 문서로 관리하고, 개인 프로젝트의 개발 기록을 남긴다.

## 주요 기능

- **Home**: 카테고리별 글 수 및 최근 작성 글
- **Study Log**: JavaScript, React, TypeScript, Frontend 학습 기록
- **Tech Trends**: 프론트엔드 및 AI 개발 이슈 기록
- **Projects**: 프로젝트별 Markdown 문서 폴더 구조
- **Troubleshooting**: 문제 발생, 해결 과정, 배운 점 기록
- **Markdown 렌더링**: Frontmatter 및 본문 표시
- **프로젝트 폴더 상태 유지**: `sessionStorage` 기반 열린 폴더 상태 보관
- **위로 가기 버튼**: 긴 문서 상단 이동 기능

## 화면 구성

```text
Home
├── Study Log
│   ├── JavaScript
│   ├── React
│   ├── TypeScript
│   └── Frontend
├── Tech Trends
├── Projects
│   └── MoneyLog
└── Troubleshooting
```

## 콘텐츠 구조

학습 문서는 `src/content` 아래 카테고리별 Markdown 파일로 관리한다.

```text
src/content/
├── javascript/
├── react/
├── typescript/
├── frontend/
├── tech-trends/
├── troubleshooting/
└── projects/
    └── money-log/
```

새 문서는 다음과 같은 Frontmatter 형식으로 작성한다.

```md
---
title: "문서 제목"
description: "문서 내용을 한 문장으로 설명"
date: "2026-10-21"
tags:
  - React
  - Zustand
---

# 문서 제목
```

## 기술 스택

| 구분 | 기술 | 버전 | 사용 위치 및 목적 |
| --- | --- | --- | --- |
| Framework | React | 19.2.8 | `src/App.tsx`, `src/pages`, `src/components`의 화면 및 컴포넌트 구성 |
| Language | TypeScript | 6.0.2 | 전체 `.ts`, `.tsx` 파일의 타입 안정성 관리 |
| Build Tool | Vite | 8.2.2 | 개발 서버, 배포용 빌드, `vite.config.ts` 설정 |
| Routing | React Router DOM | 7.18.4 | `src/App.tsx`의 페이지 라우팅과 `src/main.tsx`의 `HashRouter` 구성 |
| Markdown | React Markdown | 10.1.0 | `src/pages/ArticlePage.tsx`에서 Markdown 문서 본문 렌더링 |
| Markdown Plugin | remark-gfm | 4.0.1 | 표, 체크박스 등 GitHub Flavored Markdown 문법 지원 |
| State Management | Zustand | 5.0.15 | `src/store/useCounterStore.ts`, Zustand 학습 예제 상태 관리 |
| Styling | Tailwind CSS | 4.3.3 | `src/index.css`의 디자인 토큰 및 유틸리티 클래스 사용 |
| Vite Plugin | @tailwindcss/vite | 4.3.3 | `vite.config.ts`에서 Tailwind CSS 연결 |
| Linting | ESLint | 10.9.0 | `npm run lint`를 통한 코드 품질 검사 |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

실행 후 터미널에 표시된 로컬 주소에서 확인할 수 있다.

### 3. 배포용 빌드

```bash
npm run build
```

### 4. 코드 검사

```bash
npm run lint
```

## 프로젝트 구조

```text
src/
├── components/       # 공통 UI 컴포넌트
├── content/          # 카테고리별 Markdown 문서
├── data/             # 카테고리와 프로젝트 데이터
├── fonts/            # LINESeed, SEBANG Gothic 폰트
├── pages/            # 라우트별 페이지
├── styles/           # Markdown 스타일
├── utils/            # Markdown 메타데이터 처리 유틸리티
├── App.tsx           # 라우팅 구성
└── main.tsx          # 앱 진입점

public/
├── icons/            # 메뉴와 카테고리 아이콘
└── *.png, *.jpeg     # 대시보드와 프로젝트 이미지
```

## 디자인 원칙

- 일반 텍스트와 Markdown 본문은 **LINESeed**를 사용한다.
- 강조가 필요한 제목에는 **SEBANG Gothic**을 사용한다.
- 카테고리와 프로젝트 아이콘을 화면 전반에 일관되게 사용한다.
- 프로젝트 화면은 폴더와 문서의 계층 구조를 우선해 구성한다.

## 문서 작성 원칙

- Markdown 파일은 카테고리에 맞는 `src/content` 폴더에 추가한다.
- 파일명은 내용을 나타내는 영문 `kebab-case`를 사용한다.
- 각 문서는 제목, 설명, 날짜, 태그를 포함한 Frontmatter로 시작한다.
- 프로젝트 문서는 `src/content/projects/<project-id>` 경로에 추가한다.

## License

개인 학습 및 포트폴리오 기록을 위한 프로젝트이다.
