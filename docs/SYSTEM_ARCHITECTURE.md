# SYSTEM_ARCHITECTURE.md

# Mindly_new System Architecture

Version: 1.0

## 1. 목표

Mindly_new는 React + Vite 기반의 Mobile First PWA이다.

목표는 단순한 스트레스 관리 앱이 아니라, AI가 기록 → 분석 → 행동 →
피드백을 제공하는 AI Mind Coach를 구현하는 것이다.

------------------------------------------------------------------------

# 2. 전체 아키텍처

``` text
                React + Vite

                     │
              React Router

                     │
          Pages / Components

                     │
      Zustand + React Context

                     │
     Services (Business Layer)

  ┌────────────┬────────────┐
  │            │            │
AI Service  Media Service  Auth Service
  │            │            │
  └──────┬─────┴─────┬──────┘
         │           │
   Serverless API    Supabase
         │
 OpenAI / Freesound / Unsplash
```

------------------------------------------------------------------------

# 3. 프로젝트 구조

``` text
src/
  api/
  assets/
  components/
    common/
    layout/
    ui/
  hooks/
  lib/
  pages/
    Home/
    Coach/
    Breathe/
    Library/
    Journal/
    MindReport/
    Recovery/
    Settings/
  services/
    ai/
    auth/
    media/
    report/
    recovery/
  store/
  types/
  utils/
```

------------------------------------------------------------------------

# 4. 페이지 구성

  페이지       역할
  ------------ ----------------
  Home         대시보드
  Coach        AI 코칭
  Breathe      호흡 훈련
  Library      음악/이미지
  Journal      감사일기
  MindReport   AI 주간 리포트
  Recovery     회복 플랜
  Settings     환경설정

------------------------------------------------------------------------

# 5. Zustand Store

``` text
authStore
userStore
missionStore
journalStore
mediaStore
reportStore
recoveryStore
uiStore
```

Store는 화면이 아닌 도메인 기준으로 분리한다.

------------------------------------------------------------------------

# 6. Supabase

``` text
users
journal_entries
mood_logs
missions
weekly_reports
recovery_plans
media_favorites
ai_conversations
```

RLS(Row Level Security)를 기본 활성화한다.

------------------------------------------------------------------------

# 7. AI 흐름

``` text
사용자 입력
    ↓
AI Service
    ↓
Serverless API
    ↓
LLM
    ↓
감정 분석
    ↓
Mind Report
Recovery Plan
Media 추천
```

------------------------------------------------------------------------

# 8. Media 흐름

``` text
Emotion
    ↓
MusicService
ImageService
    ↓
Cache
    ↓
Serverless API
    ↓
Provider
(Freesound / Unsplash)
```

------------------------------------------------------------------------

# 9. 인증 구조

``` text
Supabase Auth

Email
Google
Apple(향후)
```

로그인 후 모든 데이터는 사용자별로 분리한다.

------------------------------------------------------------------------

# 10. PWA 구조

-   Manifest
-   Service Worker
-   Cache Storage
-   Offline 지원
-   Install Prompt
-   Background Update

------------------------------------------------------------------------

# 11. 배포

``` text
GitHub
   ↓
Vercel
   ↓
Production

Supabase
```

Push 시 자동 배포한다.

------------------------------------------------------------------------

# 12. 개발 원칙

-   React 18 + Vite + TypeScript
-   Tailwind CSS v4
-   ShadCN UI
-   React Router
-   Zustand
-   Supabase
-   Mobile First
-   Component 기반 설계
-   Service Layer 분리
-   Serverless API 사용
-   API Key 브라우저 노출 금지
-   Provider Pattern 적용
-   PWA 지원

------------------------------------------------------------------------

# 13. 데이터 흐름

``` text
User
 ↓
UI
 ↓
Component
 ↓
Hook
 ↓
Store
 ↓
Service
 ↓
Serverless API
 ↓
Supabase / External API
```

모든 데이터는 위 방향으로만 흐르며 역방향 의존성을 만들지 않는다.

------------------------------------------------------------------------

# 14. 구현 로드맵

## Sprint 1

-   React 프로젝트 생성
-   라우팅
-   공통 Layout
-   Zustand
-   Supabase 연결

## Sprint 2

-   기존 Mindly 기능 이관

## Sprint 3

-   AI Mind Report
-   Recovery Plan
-   AI Companion

## Sprint 4

-   Media API
-   캐시
-   오프라인
-   PWA 최적화

------------------------------------------------------------------------

# 15. 최종 비전

Mindly_new는 하나의 코드베이스로

-   Web
-   Android(PWA/Capacitor)
-   iPhone(PWA)
-   Google Play 배포

를 지원한다.

아키텍처는 기능 추가보다 유지보수성과 확장성을 우선하며, AI 기능, 미디어
서비스, 인증, 데이터 저장을 독립된 계층으로 분리하여 장기적으로 안정적인
제품으로 성장할 수 있도록 설계한다.
