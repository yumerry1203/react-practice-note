---
title: "Markdown으로 동적 게시글 페이지 만들기"
description: "Markdown 파일을 React에서 불러오고 URL에 따라 다른 게시글을 렌더링하는 과정을 정리한다."
date: "2026-09-28"
tags:
  - React
  - Markdown
  - React Router
  - Vite
  - Troubleshooting
---

# Markdown으로 동적 게시글 페이지 만들기

React 학습 내용을 Markdown 파일로 관리하고, URL에 따라 해당 Markdown 게시글을 보여주는 구조를 만들었다.

이번 작업의 목표는 게시글마다 React 페이지를 새로 만드는 것이 아니라, Markdown 파일을 추가하면 하나의 공통 페이지에서 내용을 렌더링할 수 있도록 만드는 것이었다.

## 1. Markdown 파일을 React 화면에 렌더링하기

먼저 학습 내용을 `.md` 파일로 작성했다.

```text
src/
├─ content/
│  └─ javascript/
│     ├─ this.md
│     └─ scope.md
└─ pages/
   └─ ArticlePage.tsx
```

각 게시글마다 별도의 React 컴포넌트를 만드는 대신, Markdown 파일의 내용을 읽어서 `ArticlePage`라는 하나의 공통 컴포넌트에서 보여주는 구조로 만들었다.

## 2. URL에 따라 다른 게시글 보여주기

`react-router-dom`의 동적 라우트를 이용하면 URL마다 페이지를 따로 만들지 않아도 된다.

```tsx
<Route path="/:category/:slug" element={<ArticlePage />} />
```

여기서 `:category`와 `:slug`는 URL에 따라 달라지는 값이다.

```text
/javascript/this
       ↓         ↓
category = "javascript"
slug = "this"

/react/markdown
   ↓          ↓
category = "react"
slug = "markdown"
```

`useParams()`를 사용하면 현재 URL의 `slug` 값을 가져올 수 있다. 가져온 `slug`로 같은 이름의 Markdown 파일을 찾아 화면에 렌더링했다.

## 3. 사용한 라이브러리

### react-markdown

Markdown 문자열을 React 화면에 렌더링하기 위해 사용했다.

```md
# 큰 제목
## 작은 제목

**강조**
```

위와 같은 Markdown 문법을 React 요소로 바꿔 화면에 보여준다.

### remark-gfm

`react-markdown`에서 GitHub Flavored Markdown 문법을 사용할 수 있도록 추가했다. 테이블, 체크박스, 취소선처럼 기본 Markdown보다 확장된 문법을 사용할 수 있다.

### react-router-dom

URL에 따라 서로 다른 화면을 보여주기 위해 사용했다. `:slug` 같은 동적 파라미터와 `useParams()`를 통해 현재 주소에 맞는 게시글을 찾을 수 있다.

## 4. fetch 대신 Vite의 `?raw`와 `import.meta.glob()`을 사용한 이유

처음에는 Markdown 파일을 `fetch()`로 가져오려고 했다. 하지만 이 프로젝트는 서버에서 외부 파일을 요청하는 구조가 아니라, Vite로 빌드되는 내부 프로그램이었다. 또한 라우팅 방식과 파일 경로가 겹치면서 원하는 Markdown 파일 대신 라우트 화면을 받는 문제가 생길 수 있었다.

그래서 Vite가 제공하는 `import.meta.glob()`을 사용해 Markdown 파일을 한 번에 불러오도록 변경했다.

```tsx
const posts = import.meta.glob("../content/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})
```

`?raw`는 Markdown 파일을 JavaScript 모듈처럼 실행하지 않고, 파일 안의 내용을 문자열로 가져오게 한다.

`import.meta.glob()`으로 가져온 결과는 파일 경로를 키로, 파일 내용을 값으로 가진 객체 형태가 된다.

```ts
{
  "../content/javascript/this.md": "# this ...",
  "../content/javascript/scope.md": "# scope ..."
}
```

이 방식은 게시글 파일이 늘어나도 glob 패턴에 맞는 파일을 자동으로 찾을 수 있다는 장점이 있다.

## 5. HashRouter와 BrowserRouter의 중복 문제

라우터는 앱 전체를 감싸는 역할을 한다. 그래서 `HashRouter`와 `BrowserRouter`를 동시에, 또는 중첩해서 사용하면 라우팅이 꼬일 수 있다.

```tsx
// 한 가지 라우터만 앱의 최상단에서 사용한다.
<HashRouter>
  <App />
</HashRouter>
```

정적 배포 환경에서는 서버 설정 없이도 동작하기 쉬운 `HashRouter`를 사용할 수 있다.

```text
/#/javascript/this
```

반대로 `BrowserRouter`는 깔끔한 URL을 만들 수 있지만, 새로고침했을 때 서버가 모든 경로를 앱의 진입 파일로 돌려주도록 별도 설정이 필요하다.

중요한 점은 둘 중 하나를 선택해 앱 최상단에 한 번만 사용하는 것이다.

## 6. Object.keys(), filter(), map()으로 게시글 다루기

`import.meta.glob()`의 결과는 객체이므로, 게시글 목록을 다루기 위해 먼저 `Object.keys()`를 사용했다.

```ts
const paths = Object.keys(posts)
```

이제 `paths`는 파일 경로가 담긴 배열이 된다.

카테고리에 맞는 파일만 고르고 싶다면 `filter()`를 사용한다.

```ts
const categoryPosts = paths.filter((path) =>
  path.includes(`/content/${category.slug}/`)
)
```

그리고 화면에 목록을 반복해서 출력할 때는 `map()`을 사용한다.

```tsx
{categoryPosts.map((path) => {
  const slug = path.split("/").pop()?.replace(".md", "")

  return (
    <Link key={path} to={`/${category.slug}/${slug}`}>
      {slug}
    </Link>
  )
})}
```

각 메서드의 역할은 다음처럼 구분할 수 있다.

```text
Object.keys()  → 객체에서 파일 경로 목록을 꺼낸다.
filter()       → 필요한 카테고리의 파일만 고른다.
map()          → 고른 파일들을 화면 요소로 하나씩 만든다.
```

## 7. 조건부 렌더링으로 빈 화면 처리하기

카테고리에 게시글이 있을 때는 목록을 보여주고, 없을 때는 안내 문구를 보여주도록 조건부 렌더링을 적용했다.

```tsx
{categoryPosts.length > 0 ? (
  <div>
    {categoryPosts.map((path) => {
      const slug = path.split("/").pop()?.replace(".md", "")

      return (
        <Link key={path} to={`/${category.slug}/${slug}`}>
          {slug}
        </Link>
      )
    })}
  </div>
) : (
  <div className="category-empty">
    <strong>아직 작성된 글이 없어요.</strong>
    <span>첫 번째 기록을 작성해 보세요.</span>
  </div>
)}
```

조건부 렌더링과 `map()`은 역할이 다르다.

```text
조건부 렌더링: 게시글이 있는가?
        ↓
       있다
        ↓
map(): 게시글을 하나씩 반복해서 보여준다.
```

`categoryPosts.length > 0`은 게시글 수가 0보다 큰지 확인한다. 게시글이 하나 이상이면 목록을 렌더링하고, 비어 있으면 empty 화면을 렌더링한다.

## 정리

이번 작업을 통해 Markdown 파일을 콘텐츠로 관리하고, URL과 파일 이름을 연결해 하나의 공통 페이지에서 동적으로 렌더링하는 방법을 배웠다. 또한 파일 목록을 객체에서 배열로 바꾸고, 필요한 데이터를 고르고, 반복·조건에 따라 화면을 구성하는 흐름도 함께 익혔다.

앞으로는 Markdown 파일만 추가해도 같은 구조 안에서 새로운 학습 기록을 쌓아갈 수 있다.
