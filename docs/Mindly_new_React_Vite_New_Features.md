# 🚀 Mindly_new 신규 기능 기획 (React + Vite)

## 프로젝트 목표

현재 Mindly(OfficeCalm_Ai)는 다음 기능이 구현되어 있다.

-   홈 대시보드
-   AI 스트레스 코칭
-   Office Breathe
-   콘텐츠 라이브러리
-   감사일기
-   XP / Level 시스템
-   Daily Mission
-   PWA

React + Vite 기반으로 새롭게 개발하는 **Mindly_new**는 기존 기능을
그대로 이식하는 것이 목적이 아니다.

**"AI가 사용자의 마음을 이해하고, 분석하고, 행동까지 유도하는 AI Mind
Coach"** 로 발전시키는 것이 목표이다.

------------------------------------------------------------------------

# 신규 기능 1 : AI Mind Report

## 목적

사용자는 매일 기록은 하지만 자신의 변화와 패턴을 알기 어렵다.

AI가 일주일 동안의 데이터를 분석하여 자동으로 심리 리포트를 생성한다.

## 화면

새로운 메뉴 **Mind Report** 추가

## 분석 데이터

-   AI 대화
-   감사일기
-   Daily Mission
-   Mind Energy
-   XP
-   연속 사용일(Streak)

## 출력 예시

``` text
이번 주 Mind Report

😊 긍정적인 하루 : 5일
😔 스트레스가 높았던 하루 : 2일

퇴근 이후 스트레스가 증가하는 패턴이 있습니다.

감사일기를 작성한 날에는
Mind Energy가 평균 16% 높았습니다.

추천
퇴근 직후 3분 호흡을 추가해보세요.
```

## React 구조

``` text
pages/
  MindReportPage.tsx

components/
  WeeklySummaryCard
  EmotionChart
  RecommendationCard

services/
  reportService.ts
```

------------------------------------------------------------------------

# 신규 기능 2 : AI Recovery Plan

## 목적

현재 AI는 조언만 제공한다.

새 앱에서는 실제 행동으로 이어질 수 있는 회복 루틴을 제공한다.

## 화면

Home Hero 아래 **Today's Recovery Plan** 카드 추가

## AI 생성 예시

``` text
오늘의 회복 플랜

□ 물 한잔 마시기
□ 3분 호흡하기
□ 창밖 보기
□ 감사일기 작성
□ 좋아하는 음악 듣기
```

## 완료 시

Recovery Score가 증가한다.

``` text
Recovery
42%
↓
78%
```

## React 구조

``` text
pages/
  RecoveryPage.tsx

components/
  RecoveryCard
  RecoveryChecklist

services/
  recoveryService.ts
```

## Supabase

``` text
recovery_plans
recovery_history
```

------------------------------------------------------------------------

# 신규 기능 3 : AI Companion

## 목적

기존 앱은 사용자가 AI를 호출해야 한다.

새 앱에서는 AI가 먼저 사용자에게 말을 걸고 회복 행동을 제안한다.

## 예시

### 오전

``` text
좋은 아침입니다.
오늘 중요한 일정이 있으신가요?
회의 전에 2분 호흡을 추천드립니다.
```

### 오후

``` text
지금쯤 집중력이 떨어질 시간입니다.
잠시 스트레칭을 해보세요.
```

### 퇴근

``` text
오늘도 수고하셨습니다.
오늘 감사했던 일을 하나만 적어볼까요?
```

## 화면

Home Hero 아래 **Mindly Message** 카드 추가

## React 구조

``` text
components/
  CompanionCard

services/
  companionService.ts
```

## 향후 확장

-   PWA Notification 연동
-   일정 기반 개인화 메시지
-   AI 대화 히스토리 활용

------------------------------------------------------------------------

# React 프로젝트 구조

``` text
src/
  pages/
    Home/
    Coach/
    MindReport/
    Recovery/
    Journal/
    Library/
    Settings/

  components/
  hooks/
  services/
    ai/
    supabase/
  store/
  types/
  utils/
```

------------------------------------------------------------------------

# Supabase 테이블

``` text
users
journal_entries
mood_logs
missions
recovery_plans
weekly_reports
ai_conversations
```

------------------------------------------------------------------------

# 기술 스택

-   React 18
-   Vite
-   TypeScript
-   Tailwind CSS v4
-   ShadCN UI
-   Zustand
-   React Router
-   Supabase

------------------------------------------------------------------------

# 개발 로드맵

## Phase 1

-   기존 Mindly 기능 React 마이그레이션

## Phase 2

-   AI Mind Report

## Phase 3

-   AI Recovery Plan

## Phase 4

-   AI Companion

------------------------------------------------------------------------

# 핵심 비전

기존 기능(명상, AI 코칭, 감사일기, 라이브러리)은 그대로 유지한다.

새로운 기능은 **기록 → 분석 → 행동 → 피드백**의 선순환을 만들어 사용자가
자신의 마음 상태를 지속적으로 개선할 수 있도록 돕는다.

**Mindly_new의 목표는 단순한 스트레스 관리 앱이 아니라, 개인 맞춤형 AI
Mind Coach가 되는 것이다.**
