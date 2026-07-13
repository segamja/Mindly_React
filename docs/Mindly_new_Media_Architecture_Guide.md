# Mindly_new Media Architecture (React + Vite)

## 목적

현재 프로젝트는 로컬 MP3와 로컬 이미지를 사용하고 있습니다.

React + Vite 버전에서는 모든 미디어를 외부 API 기반으로 변경합니다.

단, **API Key 보안**, **캐싱**, **오프라인 지원**, **향후 API 교체**를
고려하여 확장 가능한 구조로 설계합니다.

------------------------------------------------------------------------

## 1. 음악(Media) 서비스

-   로컬 MP3는 사용하지 않습니다.
-   `MusicService`를 생성합니다.
-   기본 Provider는 **Freesound API**입니다.
-   향후 **Loudly API** 등 다른 Provider를 쉽게 추가할 수 있도록
    Provider Pattern을 적용합니다.
-   React Component는 Provider를 직접 호출하지 않고 `MusicService`만
    사용합니다.

``` text
MusicService
    ↓
Music Provider
    ↓
External API
```

------------------------------------------------------------------------

## 2. 이미지(Media) 서비스

-   로컬 이미지는 사용하지 않습니다.
-   `ImageService`를 생성합니다.
-   기본 Provider는 **Unsplash API**입니다.
-   향후 **Pexels API**, **Pixabay API**를 쉽게 추가할 수 있도록
    Provider Pattern을 적용합니다.
-   React Component는 `ImageService`만 호출합니다.

------------------------------------------------------------------------

## 3. API 호출 구조

외부 API는 React에서 직접 호출하지 않습니다.

``` text
React
    ↓
MediaService
    ↓
Serverless API
(Vercel Serverless Function 또는 Supabase Edge Function)
    ↓
External API
    ↓
React
```

모든 API 호출은 `src/services/media`에서 관리합니다.

API Key는 브라우저에 노출되지 않아야 합니다.

------------------------------------------------------------------------

## 4. 환경변수

모든 API Key는 `.env.local`에서 관리합니다.

``` env
FREESOUND_API_KEY=
UNSPLASH_ACCESS_KEY=
LOUDLY_API_KEY=
```

Secret Key는 Serverless Function에서만 사용합니다.

------------------------------------------------------------------------

## 5. 캐싱(Cache) 구조

외부 API는 앱 실행마다 호출하지 않습니다.

### 최초 실행

``` text
Cache 확인
↓
없음
↓
API 호출
↓
다운로드
↓
Cache 저장
```

### 이후 실행

``` text
Cache 확인
↓
존재
↓
Cache 사용
```

### 캐시 정책

**이미지**

-   카테고리별 10\~20장 캐시
-   7일마다 자동 갱신

**음악**

-   최대 20곡 캐시
-   LRU(Least Recently Used) 방식으로 오래된 캐시 제거

### 저장소

-   Service Worker
-   Cache Storage API

향후 필요 시 IndexedDB로 확장 가능하도록 설계합니다.

------------------------------------------------------------------------

## 6. 오프라인 지원

-   인터넷이 없으면 Cache를 사용합니다.
-   Cache에도 없으면 기본(Default) 리소스를 사용합니다.

``` text
assets/default/

    default.jpg

    default.mp3
```

------------------------------------------------------------------------

## 7. Provider Pattern

``` text
MusicProvider

    FreesoundProvider

    LoudlyProvider

ImageProvider

    UnsplashProvider

    PexelsProvider

    PixabayProvider
```

React는 항상 `MusicService`, `ImageService`만 사용합니다.

------------------------------------------------------------------------

## 8. 권장 디렉터리 구조

``` text
src/

  services/

    media/

      MusicService.ts
      ImageService.ts

      cache/
        CacheManager.ts

      providers/
        FreesoundProvider.ts
        LoudlyProvider.ts
        UnsplashProvider.ts
        PexelsProvider.ts
        PixabayProvider.ts

api/

  media/
    music.ts
    images.ts
```

------------------------------------------------------------------------

## 9. AI 기반 미디어 큐레이션

AI가 감정을 분석하여 음악과 이미지를 자동 추천합니다.

``` text
사용자 입력
"오늘 너무 지치고 우울해요."

↓

Emotion = stress

↓

MusicService.getPlaylist("stress")

↓

ImageService.getGallery("forest")
```

------------------------------------------------------------------------

## 10. 개발 원칙

-   React Component는 외부 API를 직접 호출하지 않는다.
-   모든 미디어는 MediaService를 통해 접근한다.
-   모든 외부 API는 Serverless Function을 통해 호출한다.
-   API Key는 브라우저에 노출하지 않는다.
-   최초 1회 다운로드 후 Cache를 사용한다.
-   일정 기간이 지나면 백그라운드에서 Cache를 갱신한다.
-   오프라인에서도 정상 동작해야 한다.
-   API 변경 시 React 코드를 수정하지 않도록 Provider Pattern을
    적용한다.
-   AI가 사용자 감정에 맞는 음악과 이미지를 자동 추천하도록 설계한다.
