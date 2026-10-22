---
title: "2026년 10월 셋째 주 프론트엔드 & AI 이슈"
description: "AI 기반 E2E 테스트, Next.js 성능, 패키지 관리, DevTools MCP, AI Agent 협업 흐름을 정리한다."
date: "2026-10-22"
tags:
  - AI Agent
  - Frontend Performance
  - Playwright
  - Package Management
  - DevTools
---

# 2026년 10월 셋째 주 프론트엔드 & AI 이슈

최근 2주간 국내외 기업 기술 블로그와 공식 개발 블로그에서 확인한 프론트엔드와 AI 개발 이슈를 기록했다.

> 기준 기간: 2026.10.08 ~ 2026.10.22

## 1. AI로 E2E 회귀 테스트 자동화하기

- 발표일: 2026.10.16
- 출처: [LY Corporation Tech Blog](https://techblog.lycorp.co.jp/ko/ai-e2e-test-automation)
- 키워드: AI, Playwright, E2E Test Automation

LY Corporation은 AI를 활용해 Playwright 기반 E2E 테스트를 생성하고, 반복 실행과 검증을 수행하는 자동화 파이프라인을 구축했다. AI가 테스트 코드를 작성하는 데서 끝나지 않고, 테스트 명세를 기준으로 locator를 탐색하고 실행 결과를 검증한 뒤 사람이 최종 리뷰하는 구조이다.

기존 수동 테스트 98개를 자동화했고, 테스트 범위도 196개까지 확대했다. 이 사례의 핵심은 AI가 구현 방법은 바꿀 수 있어도 테스트의 합격 기준 자체를 바꾸면 안 된다는 점이다.

프론트엔드에서는 Playwright를 단순 테스트 도구가 아니라 AI Agent와 연결해 **구현 → 실행 → 검증 → 수정** 흐름을 만드는 도구로 이해할 필요가 있다.

## 2. Next.js 16.4 기반 Navigation 성능 개선

- 발표일: 2026.10.16
- 출처: [Next.js Blog](https://nextjs.org/blog/improving-navigation-experience-in-v0-with-nextjs-16-4)
- 키워드: Next.js, Prefetch, Performance, Playwright, AI Agent

Vercel은 v0 서비스에서 Next.js 16.4의 Partial Prefetching을 활용해 페이지 이동 성능을 개선했다. 기존 `prefetch={true}`가 목적지 페이지 전체를 미리 가져오는 방식이었다면, Partial Prefetching은 재사용 가능한 부분을 먼저 준비하고 나머지는 실제 이동 중 가져오는 방식으로 동작한다.

또한 Playwright 테스트와 Coding Agent를 연결해 테스트 작성, 실패 확인, 캐싱 및 Prefetch 수정, 재테스트 과정을 반복하도록 구성했다. 서버 중심 구조에서도 빠른 페이지 이동 경험을 어떻게 만드는지 살펴볼 수 있는 사례이다.

## 3. 토스뱅크 패키지 관리 #1 — ESM Only

- 발표일: 2026.10.15
- 출처: [Toss Tech](https://toss.tech/article/53987)
- 키워드: JavaScript, ESM, CommonJS, Package

토스뱅크는 내부 패키지를 ESM과 CommonJS 두 방식으로 배포하던 구조에서 ESM-only로 전환했다. Dual Package 환경에서는 같은 패키지가 ESM과 CommonJS에서 각각 로드되면서 동일한 모듈이 두 번 생성될 수 있다.

React Context처럼 참조 동일성이 중요한 객체에서는 Provider와 Hook이 서로 다른 Context 인스턴스를 바라보는 문제도 생길 수 있다. `import`와 `export`는 단순 문법이 아니라 번들링, 패키지 배포, 런타임 동작과 연결되는 개념이라는 점을 확인했다.

## 4. 토스뱅크 패키지 관리 #2 — 안정성, 예측 가능성, 디버깅

- 발표일: 2026.10.16
- 출처: [Toss Tech](https://toss.tech/article/package-management-2)
- 키워드: TypeScript, Build, Browser Compatibility, Package Design

토스뱅크는 패키지를 설계하고 운영할 때 안정성, 예측 가능성, 디버깅 편의성을 핵심 기준으로 사용한다. 특히 TypeScript의 `target`을 낮추거나 트랜스파일러를 사용한다고 해서 모든 구형 브라우저 호환성이 해결되는 것은 아니다.

문법 변환과 Web API 지원 여부는 별도로 판단해야 한다. TypeScript target, Babel 또는 Vite, polyfill, 브라우저 호환성의 관계를 함께 이해할 필요가 있다.

## 5. LINE 스키마니 메인 페이지 성능 개선

- 발표일: 2026.10.13
- 출처: [LY Corporation Tech Blog](https://techblog.lycorp.co.jp/ja/20261013a)
- 키워드: React, SSR, TanStack Query, LCP, TTFB, Cache

CSR 중심 페이지의 초기 표시 속도를 개선하기 위해 SSR과 TanStack Query prefetch를 적용한 사례이다. SSR로 첫 화면 콘텐츠는 빨라졌지만, API 응답을 기다리면서 TTFB가 증가하는 새로운 문제가 발생했다.

이후 서버 측 Stale-While-Revalidate 캐시로 문제를 해결했다. 성능 최적화는 하나의 기술을 도입하는 데서 끝나는 것이 아니라, 지표를 측정하며 병목이 이동하는 과정을 계속 확인해야 한다는 점을 보여준다.

## 6. Chrome DevTools MCP의 CSS 분석 기능 강화

- 발표일: 2026.10.20
- 출처: [Chrome for Developers](https://developer.chrome.com/blog/new-in-devtools-november-2026)
- 키워드: DevTools, CSS, MCP, AI Agent

Chrome DevTools MCP는 `get_css_styles`를 통해 computed styles, matched rules, inherited rules, pseudo-elements, `@keyframes`, `@property`처럼 적용된 CSS 정보를 구조적으로 읽을 수 있게 기능을 강화했다.

이제 AI Agent는 화면만 보고 UI 문제를 판단하는 수준을 넘어 실제 CSS 규칙을 확인해 원인을 분석할 수 있다. 사용자 관점에서 UI를 확인하는 브라우저 점검과 CSS, Console, Network를 구조적으로 분석하는 DevTools MCP 방식의 차이를 이해할 수 있다.

## 7. GitHub Copilot에 코드베이스 맥락 제공하기

- 발표일: 2026.10.12
- 출처: [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/)
- 키워드: AI Coding, Context, Custom Instructions, Skills, MCP

GitHub는 Copilot을 사용할 때 매번 긴 프롬프트로 프로젝트를 설명하기보다, 저장소 자체에 프로젝트 규칙과 맥락을 제공하는 방식을 권장한다. Custom Instructions, Skills, 프로젝트 규칙 문서, Playwright 같은 MCP 도구를 조합하면 AI가 코드베이스의 구조와 규칙을 이해한 상태에서 작업할 수 있다.

AI 활용 능력의 핵심이 프롬프트 작성에서 Context와 Tool을 설계하는 능력으로 이동하고 있다는 점이 인상적이다. 개인 프로젝트에서도 기술 스택, 컴포넌트 구조, 스타일 규칙, 테스트 기준을 문서로 명시하면 AI 작업 품질을 높일 수 있다.

## 8. GitHub Copilot Agent 작업을 VS Code에서 검토하기

- 발표일: 2026.10.19
- 출처: [GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-continue-a-github-copilot-app-session-in-vs-code/)
- 키워드: AI Agent, VS Code, Code Review, Workflow

GitHub Copilot Agent가 수행한 작업의 컨텍스트와 코드 변경 사항을 VS Code로 이어받아 사람이 직접 검토하고 수정하는 워크플로를 소개했다. AI가 큰 작업을 먼저 수행한 뒤, 개발자가 IDE에서 diff를 확인하고 테스트하거나 직접 수정하는 구조이다.

AI가 개발자를 완전히 대체하기보다 AI가 작업을 수행하고 사람이 최종 검증과 판단을 담당하는 협업 방식이 실제 개발 도구의 기본 흐름으로 자리 잡고 있다. 기능 구현을 맡기더라도 변경된 코드, 브라우저 결과, 테스트 결과를 직접 확인하는 습관이 중요하다.

## 9. CSS-in-JS에서 CSS Modules로 전환한 GitHub

- 발표일: 2026.09.25
- 출처: [GitHub Engineering Blog](https://github.blog/engineering/architecture-optimization/improving-site-performance-by-shipping-more-css/)
- 키워드: CSS Modules, CSS-in-JS, SSR, Performance

기준 기간 밖의 글이지만 프론트엔드 성능과 스타일링 구조를 이해하는 데 의미가 있어 함께 기록했다. GitHub는 github.com의 스타일링을 CSS-in-JS 기반에서 CSS Modules 중심으로 전환했다.

일부 Primer 컴포넌트 전환 과정에서 서버 렌더링 시간과 클라이언트 스타일 초기화 비용이 감소했고, 이를 계기로 전체 코드베이스의 스타일 구조를 점진적으로 변경했다. CSS Modules, Tailwind CSS, CSS-in-JS 중 하나가 항상 정답인 것이 아니라 프로젝트 규모, 런타임 비용, 유지보수성을 기준으로 선택해야 한다.

## 이번 기록에서 가져갈 흐름

```text
JavaScript / React 기본기
        ↓
브라우저와 렌더링 구조 이해
        ↓
성능 측정 및 최적화
        ↓
E2E 테스트 자동화
        ↓
AI Agent를 개발 과정에 연결
        ↓
사람이 결과를 검증
```

AI 도구가 강력해지고 있지만, 중요한 것은 AI에게 더 많은 작업을 맡기는 것보다 무엇을 검증해야 하는지 개발자가 명확하게 정의하는 일이다. 프론트엔드 학습도 새로운 프레임워크를 계속 추가하기보다 JavaScript와 React 기본기를 바탕으로 브라우저, 성능, 테스트까지 연결해 이해할 필요가 있다.

## 정리

- AI Agent는 코드 생성뿐 아니라 E2E 테스트와 브라우저 검증 과정에도 활용된다.
- 페이지 이동과 첫 화면 성능은 Prefetch, SSR, 캐시, 측정 지표를 함께 고려해야 한다.
- 패키지 배포와 브라우저 호환성은 빌드 도구가 처리하는 영역과 직접 판단해야 하는 영역을 구분해야 한다.
- AI 작업의 결과는 코드 diff, 브라우저 결과, 테스트 결과를 통해 사람이 검증한다.
