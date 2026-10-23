---
title: "(포트폴리오) 이미지 로딩 상태별 화면 구현"
description: "프로젝트 상세 모달과 사이드 프로젝트 모달에서 이미지 로딩, 완료, 오류 상태를 분리해 표시했다."
date: "2026-10-23"
tags:
  - React
  - Image Loading
  - useState
  - useCallback
  - Accessibility
---

# 포트폴리오 이미지 로딩 상태별 화면 구현

포트폴리오의 프로젝트 상세 모달과 사이드 프로젝트 작업 과정 모달에서 이미지를 불러오는 동안 빈 화면이 보이지 않도록 로딩 상태 UI를 구현했다. 공통 `LoadingImage` 컴포넌트에서 이미지의 로딩, 완료, 오류 상태를 관리하도록 구성했다.

## 1. 문제 상황

이미지 네트워크 요청이 완료되기 전에는 이미지 영역이 비어 보이고, 사용자는 현재 로딩 중인지 오류가 발생했는지 알기 어렵다. 특히 모달 안의 대표 이미지와 작업 과정 이미지는 영역이 크기 때문에 로딩 상태가 없으면 화면이 늦게 완성되는 것처럼 느껴질 수 있다.

![모달을 열었지만 작업 과정 이미지가 아직 표시되지 않은 화면](portfolio-image-loading-before.png)

모달 내 이미지가 늦게 로드되어 모달 헤더부분만 일정시간 노출된다 

## 2. 이전에 적용한 이미지 사전 로딩

사이드 프로젝트 카드의 작업 과정 이미지는 사용자가 모달을 열기 전 두 시점에 미리 요청했다.

- 카드가 화면에서 약 `300px` 거리까지 접근했을 때
- 사용자가 카드에 마우스를 올리거나 키보드 포커스를 줬을 때

실제 이미지 요청은 `processImagePreloader.ts`에서 처리했다.

- `new Image()`를 사용한 브라우저 이미지 요청
- 이미 로드한 주소를 `Set`에 기록
- 현재 로딩 중인 요청을 `Map`으로 관리
- 같은 이미지의 중복 요청 방지
- 페이지 새로고침 전까지 메모리에 기록하고 브라우저 캐시 활용

모달에서 바로 보이는 대표 이미지와 작업 과정 이미지에는 `loading="eager"`, `fetchPriority="high"`를 적용했다. 상세 하단 이미지는 `loading="lazy"`로 설정해 스크롤이 가까워질 때 요청하도록 구성했다.

## 3. 사전 로딩만으로 해결되지 않은 이유

사전 로딩은 이미지 요청을 먼저 시작하게 하지만, 사용자가 모달을 여는 시점까지 이미지가 반드시 표시 가능한 상태가 된다는 보장은 아니다. 카드가 화면에 들어온 직후 바로 클릭하거나, 네트워크가 느리거나, 이미지 파일이 큰 경우에는 이미지가 아직 로드 중일 수 있다.

따라서 사전 로딩은 대기 시간을 줄이는 최적화로 유지하고, 실제 로딩이 끝나기 전의 화면을 처리하는 이미지 상태 UI를 추가했다.

## 4. 해결 방법

이미지 상태를 `loading`, `loaded`, `error` 세 가지로 나눴다.

| 상태 | 화면 처리 |
| --- | --- |
| `loading` | 이미지 영역을 확보하고 회전 아이콘을 표시한다. |
| `loaded` | 회전 아이콘을 제거하고 이미지를 부드럽게 표시한다. |
| `error` | 오류 안내 문구를 표시한다. |

이미지 상태 처리를 여러 모달에서 반복하지 않도록 `LoadingImage.tsx` 공통 컴포넌트로 분리했다.

```tsx
import { useCallback, useState } from 'react'
import type { ImgHTMLAttributes } from 'react'

interface LoadingImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string
  alt: string
  containerClassName?: string
  loadingText?: string
}

const LoadingImage = ({
  src,
  alt,
  containerClassName = '',
  loadingText = '이미지를 불러오고 있습니다.',
  className = '',
  ...imageProps
}: LoadingImageProps) => {
  const [imageState, setImageState] = useState<{
    src: string
    status: 'loading' | 'loaded' | 'error'
  }>({ src, status: 'loading' })

  const status = imageState.src === src ? imageState.status : 'loading'

  const setImageRef = useCallback((image: HTMLImageElement | null) => {
    if (!image?.complete) return

    setImageState({
      src,
      status: image.naturalWidth > 0 ? 'loaded' : 'error',
    })
  }, [src])

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gray/10 ${containerClassName}`}
      aria-busy={status === 'loading'}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-12" role="status">
          <span
            className="h-28 w-28 animate-spin rounded-full border-3 border-gray/40 border-t-primary"
            aria-hidden="true"
          />
          <span className="sr-only">{loadingText}</span>
        </div>
      )}

      {status === 'error' && (
        <p className="px-20 py-40 text-center text-sm text-gray-dark" role="status">
          이미지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      <img
        {...imageProps}
        ref={setImageRef}
        src={src}
        alt={alt}
        onLoad={() => setImageState({ src, status: 'loaded' })}
        onError={() => setImageState({ src, status: 'error' })}
        className={`transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  )
}

export default LoadingImage
```

## 5. 캐시된 이미지 처리

이미지가 브라우저 캐시에 있으면 `onLoad` 이벤트가 이미 지난 상태로 컴포넌트가 연결될 수 있다. `setImageRef`에서 `image.complete`를 확인하고, `naturalWidth`를 기준으로 로드 성공 또는 실패 상태를 바로 설정했다.

```tsx
const setImageRef = useCallback((image: HTMLImageElement | null) => {
  if (!image?.complete) return

  setImageState({
    src,
    status: image.naturalWidth > 0 ? 'loaded' : 'error',
  })
}, [src])
```

이 방식으로 캐시된 이미지에도 불필요하게 회전 아이콘이 오래 표시되는 상황을 줄였다.

## 6. 적용 영역과 이미지 공간

로딩 중에도 레이아웃이 흔들리지 않도록 이미지마다 미리 영역을 확보했다.

| 적용 영역 | 모바일 | 태블릿 이상 |
| --- | --- | --- |
| 프로젝트 대표 이미지 | `22rem` | `36rem` |
| 프로젝트 상세 이미지 | `18rem` | `24rem` |
| 사이드 프로젝트 작업 과정 이미지 | `26rem` | `36rem` |

이미지 로딩이 끝나면 원본 비율과 전체 크기로 자연스럽게 확장되도록 구성했다.

## 7. 접근성 보완

로딩 상태의 컨테이너에 `aria-busy`를 적용해 현재 이미지 로딩 중인지 전달했다. 회전 아이콘에는 `aria-hidden="true"`를 적용하고, 화면에 보이지 않는 `loadingText`를 `role="status"` 영역에 넣어 로딩 상태를 안내했다.

오류가 발생했을 때도 `role="status"`를 사용해 이미지 로드 실패 안내 문구를 전달했다.

## 8. 결과 및 배운 점

- 이미지 로딩 중에는 회전 아이콘이 표시되고, 완료되면 이미지가 자연스럽게 나타난다.
- 로드 실패 시 빈 영역 대신 오류 안내 문구가 표시된다.
- 캐시된 이미지는 `image.complete`를 확인해 불필요한 로딩 표시를 줄였다.
- 사전 로딩은 요청 대기 시간을 줄이는 용도로 유지하고, 모달을 열었을 때 이미지를 기다리는 상태는 `LoadingImage`로 처리했다.
- 공통 컴포넌트로 분리해 프로젝트 상세 모달과 사이드 프로젝트 모달에서 같은 로딩 경험을 제공했다.
- `aria-busy`와 `role="status"`를 사용해 이미지 로딩과 오류 상태를 보조 기술에도 전달했다.
- 린트와 빌드를 통과했다.
