---
title: "(Money-Log)아코디언 상태를 sessionStorage로 유지하기"
description: "프로젝트 폴더의 열림/닫힘 상태가 페이지 이동 뒤 초기화되는 문제를 sessionStorage로 해결하기"
date: "2026-10-13"
tags:
  - React
  - sessionStorage
  - useState
---

# 프로젝트 아코디언 상태를 sessionStorage로 유지하기

프로젝트 페이지의 폴더는 아코디언 방식으로 열고 닫을 수 있다. 기본 상태는 모두 열림으로 두되, 사용자가 페이지를 이동했다가 돌아와도 마지막으로 선택한 상태를 유지하고 싶었다.

## 1. 문제 발생

프로젝트 폴더의 열림 상태는 `expandedProjectIds` 배열로 관리했다. 처음에는 모든 프로젝트 ID를 배열에 넣어 기본으로 펼쳐지게 만들었다.

```tsx
const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>(
  () => projectData.map((project) => project.id),
);
```

폴더를 클릭하면 ID를 배열에 추가하거나 제거한다.

```tsx
const toggleProject = (projectId: string) => {
  setExpandedProjectIds((previousIds) => (
    previousIds.includes(projectId)
      ? previousIds.filter((id) => id !== projectId)
      : [...previousIds, projectId]
  ));
};
```

하지만 다른 페이지로 이동한 뒤 프로젝트 페이지로 돌아오면 컴포넌트가 다시 만들어지고, `useState`의 초기값이 다시 적용됐다. 사용자가 닫아 둔 폴더도 다시 열린 상태가 됐다.

## 2. 원인 분석

`useState`의 상태는 현재 컴포넌트가 화면에 존재하는 동안에만 유지된다. 라우트가 바뀌어 `ProjectsPage`가 언마운트되면 메모리에 있던 `expandedProjectIds`도 사라진다.

프로젝트 폴더 상태는 서버에 영구 보관할 데이터가 아니라, 현재 탭 안에서만 사용자가 보고 있던 화면 상태이다. 따라서 브라우저 저장소 중 현재 탭의 수명과 같은 `sessionStorage`가 적합했다.

## 3. 해결 방법

먼저 저장소 키를 상수로 분리하고, `useEffect`를 추가한다.

```tsx
import { useEffect, useState } from 'react';

const expandedProjectsStorageKey = 'expanded-project-ids';
```

초기 상태를 만들 때 `sessionStorage`에 저장된 배열을 먼저 읽는다. 저장값이 없거나 JSON 형식이 잘못된 경우에는 모든 프로젝트를 연 기본값을 사용한다.

```tsx
const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>(() => {
  const initialProjectIds = projectData.map((project) => project.id);
  const savedProjectIds = sessionStorage.getItem(expandedProjectsStorageKey);

  if (!savedProjectIds) return initialProjectIds;

  try {
    const parsedProjectIds: unknown = JSON.parse(savedProjectIds);

    return Array.isArray(parsedProjectIds)
      ? parsedProjectIds.filter((id): id is string => typeof id === 'string')
      : initialProjectIds;
  } catch {
    return initialProjectIds;
  }
});
```

상태가 바뀔 때마다 배열을 문자열로 변환해 저장한다.

```tsx
useEffect(() => {
  sessionStorage.setItem(
    expandedProjectsStorageKey,
    JSON.stringify(expandedProjectIds),
  );
}, [expandedProjectIds]);
```

`toggleProject` 함수는 그대로 사용한다. 폴더를 열거나 닫으면 `expandedProjectIds`가 바뀌고, `useEffect`가 최신 상태를 `sessionStorage`에 기록한다.

## 4. localStorage와 비교

| 구분 | `localStorage` | `sessionStorage` |
| --- | --- | --- |
| 유지 범위 | 브라우저를 닫았다 열어도 유지된다. | 현재 탭이 열려 있는 동안만 유지된다. |
| 새로고침 | 유지된다. | 유지된다. |
| 탭 종료 | 유지된다. | 삭제된다. |
| 적합한 데이터 | 사용자가 계속 기억하기를 기대하는 설정값 | 현재 작업 흐름에만 필요한 임시 화면 상태 |

이번 아코디언 상태는 프로젝트 데이터 자체가 아니라 현재 탭에서의 화면 상태이다. 탭을 닫은 뒤에도 마지막으로 펼친 폴더를 계속 기억할 필요는 없으므로 `localStorage`보다 `sessionStorage`를 선택했다.

## 5. 결과 및 배운 점

- 페이지를 이동했다가 프로젝트 화면으로 돌아와도 마지막 열림·닫힘 상태가 유지된다.
- 새로고침해도 같은 탭 안에서는 상태가 유지된다.
- 탭을 닫으면 저장값이 사라져 다음 접속에서는 모든 폴더가 열린 기본 상태로 시작한다.
- 컴포넌트의 일시적인 화면 상태는 `useState`만으로 충분하지만, 라우트 이동 이후에도 유지해야 한다면 브라우저 저장소를 함께 사용할 수 있다.
- 저장소에서 읽은 값은 신뢰할 수 없으므로 `try...catch`와 배열 검사처럼 안전한 기본값 처리도 필요하다.
