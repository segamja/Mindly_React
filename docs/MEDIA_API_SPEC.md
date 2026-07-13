# MEDIA_API_SPEC.md

## Mindly_new Media API Specification

Version: 1.0

## 목적

이 문서는 Cursor가 Mindly_new의 미디어 시스템을 일관성 있게 구현할 수
있도록 API, 캐시, Provider, AI 큐레이션 규칙을 정의한다.

------------------------------------------------------------------------

# 1. 전체 아키텍처

``` text
React UI
    │
MusicService / ImageService
    │
CacheManager
    │
Serverless API
(Vercel / Supabase Edge Function)
    │
Media Provider
(Freesound / Loudly / Unsplash / Pexels)
```

외부 API는 React에서 직접 호출하지 않는다.

------------------------------------------------------------------------

# 2. 음악 API

## 기본 Provider

-   Freesound API

용도

-   Rain
-   Ocean
-   Forest
-   White Noise
-   Coffee Shop
-   Office Ambience

### 검색 키워드

  Emotion   Keywords
  --------- ------------------------------
  stress    rain, forest, calm
  anxiety   ocean, breathing
  burnout   meditation, birds
  focus     white noise, office ambience
  relax     piano, ambient

### 반환 형식

``` ts
interface MusicItem {
  id: string
  title: string
  url: string
  duration: number
  thumbnail?: string
  tags: string[]
}
```

------------------------------------------------------------------------

# 3. 이미지 API

## 기본 Provider

-   Unsplash API

### 검색 키워드

  Emotion   Keywords
  --------- ----------
  stress    forest
  anxiety   ocean
  burnout   sunrise
  relax     mountain
  happy     flowers

### 반환 형식

``` ts
interface ImageItem {
  id: string
  url: string
  thumb: string
  author: string
}
```

------------------------------------------------------------------------

# 4. Emotion Mapping

``` text
stress
 ├─ Music : rain / forest
 └─ Image : forest

anxiety
 ├─ Music : ocean
 └─ Image : beach

burnout
 ├─ Music : meditation
 └─ Image : sunrise

focus
 ├─ Music : white noise
 └─ Image : minimal desk

happy
 ├─ Music : acoustic
 └─ Image : flowers
```

------------------------------------------------------------------------

# 5. Cache 정책

## 이미지

-   최초 실행 시 10\~20장 다운로드
-   7일 유지
-   백그라운드 갱신

## 음악

-   최대 20곡 캐시
-   최근 사용 우선(LRU)
-   오래된 캐시 자동 삭제

------------------------------------------------------------------------

# 6. CacheManager 인터페이스

``` ts
getMusic(category)
saveMusic(category)

getImages(category)
saveImages(category)

isExpired(category)
clearExpired()
```

------------------------------------------------------------------------

# 7. API 실패 처리

순서

``` text
Cache

↓

Serverless API

↓

Default Resource
```

API 실패 시 앱이 중단되어서는 안 된다.

------------------------------------------------------------------------

# 8. Rate Limit 대응

-   동일 검색은 캐시 사용
-   중복 호출 방지
-   Background Refresh
-   Exponential Backoff 재시도
-   API 실패 시 기본 리소스 사용

------------------------------------------------------------------------

# 9. Serverless API

``` text
/api/music
/api/images
```

React는 위 API만 호출한다.

------------------------------------------------------------------------

# 10. React Hook

``` ts
const { music } = useMusic("stress")
const { images } = useImages("forest")
```

컴포넌트는 Hook만 사용한다.

------------------------------------------------------------------------

# 11. 추천 폴더 구조

``` text
src/
  hooks/
    useMusic.ts
    useImages.ts

  services/
    media/
      MusicService.ts
      ImageService.ts
      CacheManager.ts

      providers/
        FreesoundProvider.ts
        LoudlyProvider.ts
        UnsplashProvider.ts
        PexelsProvider.ts
        PixabayProvider.ts

api/
  music.ts
  images.ts
```

------------------------------------------------------------------------

# 12. 개발 체크리스트

-   [ ] React에서 외부 API 직접 호출 금지
-   [ ] Serverless API 사용
-   [ ] API Key 노출 금지
-   [ ] Service Worker 캐시 적용
-   [ ] Cache Storage API 사용
-   [ ] Offline 지원
-   [ ] Default 이미지/음악 제공
-   [ ] Provider Pattern 적용
-   [ ] AI 감정 기반 미디어 추천
-   [ ] API 교체 시 React 수정 없이 Provider만 변경

------------------------------------------------------------------------

# 13. 구현 우선순위

## Sprint 1

-   MusicService
-   ImageService
-   Serverless API
-   기본 캐시

## Sprint 2

-   Provider Pattern
-   Background Refresh
-   LRU Cache

## Sprint 3

-   AI Emotion Mapping
-   자동 추천
-   Offline 강화

------------------------------------------------------------------------

# 최종 목표

사용자는 음악과 이미지를 "재생"하거나 "조회"하는 것이 아니라, AI가 현재
감정 상태를 분석하여 가장 적합한 힐링 콘텐츠를 자동으로 추천받는 경험을
제공한다.

모든 미디어는 빠르고 안정적으로 제공되어야 하며, 오프라인에서도 기본
기능을 유지해야 한다.
