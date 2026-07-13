# Mindly (OfficeCalm_Ai) — GPT용 프로젝트 컨텍스트

> **이 문서의 목적:** ChatGPT·Claude 등 AI가 이 프로젝트의 현재 구현 상태를 빠르게 파악하고, 이어서 개발·리팩터링·React 마이그레이션 등을 수행할 수 있도록 작성된 **단일 컨텍스트 파일**입니다.  
> **최종 갱신:** 2026-07-13 · **앱 버전:** v2.5  
> **원본 저장소:** https://github.com/segamja/OfficeCalm_Ai  
> **라이브 데모:** https://segamja.github.io/OfficeCalm_Ai/

---

## 1. 한 줄 요약

**Mindly**는 만성 번아웃·직무 스트레스 직장인을 위한 **백엔드 없는 PWA 웹앱 MVP**입니다.  
Vanilla HTML/CSS/JS로 구현되었으며, 사용자 데이터·XP·감사일기·레벨은 모두 **localStorage**에 저장됩니다. AI는 실제 API가 아닌 **프리셋 기반 가상 코칭 스크립트**입니다.

---

## 2. 로컬 환경 (현재 워크스페이스)

| 항목 | 값 |
|------|-----|
| 로컬 경로 | `d:\1)MyDoc\7)스터디\바이브코딩\OfficeCalm_React_260713` |
| Git remote | `https://github.com/segamja/OfficeCalm_Ai.git` |
| 최신 커밋 | `974f94c` — Fix stale mobile home layout cache and improve PWA update (v2.5) |
| 실행 방법 | `npm start` → http://localhost:3000 |
| 빌드 도구 | 없음 (`npx serve`로 정적 서빙) |

---

## 3. 기술 스택 & 아키텍처 원칙

| 영역 | 선택 | 이유 |
|------|------|------|
| 마크업 | HTML5 단일 페이지 (`index.html`) | 빌드 없이 즉시 실행 |
| 스타일 | Vanilla CSS (`css/style.css`) | 유지보수 단순화 |
| 로직 | Vanilla JS ES6+ (IIFE, `window.OfficeCalm` 네임스페이스) | import/export 없이 `<script>` 태그 로드 |
| 데이터 | localStorage + sessionStorage | 서버·DB 없음, 프라이버시 보호 |
| 오디오 | HTML5 `<audio>` + 로컬 MP3 | 네이티브 재생 |
| 배포 | GitHub Pages + GitHub Actions | 정적 호스팅 |
| PWA | manifest.json + service-worker.js | 설치·오프라인·자동 업데이트 |

### 핵심 설계 원칙

1. **모듈 패턴:** 각 JS 파일은 `(function (OC) { ... })(window.OfficeCalm = window.OfficeCalm || {})` IIFE로 `OC`에 함수를 등록
2. **상태 단일 소스:** `app.js`의 `officeCalm_user_state`가 XP·레벨·일기·미션 등 핵심 상태 관리
3. **AI ≠ 라이브러리:** AI 탭 = 코칭 스크립트 출력 / 라이브러리 탭 = 배경음·효과음 재생 (역할 분리)
4. **버전 단일 소스:** `js/version.js`의 `window.MindlyVersion` → `APP_VERSION`, `SW_CACHE_VERSION`

---

## 4. 화면 구조 (5탭 단일 화면)

PC·모바일 공통으로 **하단 5탭 바**를 사용하며, 활성 탭 패널 1개만 전체 화면에 표시됩니다. 앱 최대 너비 640px, 중앙 정렬.

| 탭 ID | 화면명 | 주요 콘텐츠 |
|-------|--------|-------------|
| `home` | 홈 | Mindly 브랜드·스탯(Lv/XP/Mind Energy/연속) → Hero Card(인사·미션) → 응원·명상·음악 토글 |
| `ai` | AI 스트레스 관리실 | 대화형 인트로, 4종 프리셋 + 자유 입력, 타이핑 스크립트, 브리드 이동 CTA |
| `breathe` | 오피스 브리드 | 4-2-4 호흡 버블 가이드, 힐링 이미지 갤러리 (8초 랜덤 전환) |
| `library` | 콘텐츠 라이브러리 | 7종 오디오 트랙, 레벨 게이트, 미니 플레이어 |
| `journal` | 감사일기 | 작성·수정·히스토리 |

- 기본 탭: `home`
- 마지막 탭: `sessionStorage.officeCalm_active_tab`에 저장
- 닉네임 미설정 시 항상 `home`으로 고정

---

## 5. 구현 완료 기능 상세

### 5.1 홈 (Home)

- **상단:** Mindly 로고(`care.png`)·슬로건·오늘 날짜·설정(⚙️) 버튼
- **스탯 카드:** Lv/XP 진행바, Mind Energy %, 연속 일수(streak)
- **Hero Card:** 시간대별 인사(🌤/☀️/🌆/🌙), 닉네임, 오늘 컨디션, 오늘의 미션 3종, "오늘 시작하기" 버튼
- **응원 한줄:** 랜덤 데일리 메시지 8종
- **음악 ON/OFF + 미니 플레이어:** Spotify 스타일 재생바·일시정지·정지
- **레이아웃:** v2.2+ 브랜드·스탯이 Hero Card 위에 배치

### 5.2 온보딩 (`onboarding.js`)

- 최초 실행 시 닉네임 입력 모달
- `localStorage.nickname`에 저장
- 설정 화면에서 닉네임 변경 가능
- 닉네임 없으면 AI 탭 등으로 이동 제한

### 5.3 AI 스트레스 관리실 (`ai-engine.js`)

- **프리셋 4종:**
  - `meeting` — 회의 5분 전
  - `boss` — 상사 잔소리 직후
  - `commute` — 출근길 무기력
  - `overtime` — 야근 번아웃
- **자유 입력:** 사용자 텍스트 기반 커스텀 스크립트
- **타이핑 효과:** 스크립트 출력 영역에 글자 단위 출력
- **자동 스크롤:** 프리셋·생성 클릭 시 출력 영역으로 스크롤
- **완료 CTA:** 스크립트 완료 후 "브리드로 이동" 버튼 표시
- **XP:** 스크립트 생성 시 +15 XP
- **BGM:** 홈에서 음악 ON일 때만 AI 세션 BGM 자동 재생 (프리셋별 트랙 매핑)
- **마지막 프리셋:** `localStorage.mindly_last_preset` — 브리드 추천 문구에 반영

### 5.4 오피스 브리드 (`gallery.js` + CSS 애니메이션)

- **호흡 패턴:** 4초 들이쉬기 → 2초 멈추기 → 4초 내쉬기
- **시각 가이드:** 호흡 버블 크기·색상 애니메이션
- **갤러리:** `calm-01~06.jpg` 8초 랜덤 전환 (페이드 500ms)
- **AI 연동:** 마지막 AI 프리셋에 따른 추천 문구 표시
- **미션:** 브리드 완료 시 `dailyMissions.breathe = true`

### 5.5 콘텐츠 라이브러리 (`audio-player.js` + `level-gate.js`)

| 트랙 ID | 제목 | 시간 | 해금 조건 | 실제 MP3 |
|---------|------|------|-----------|----------|
| `white-noise` | 사무실 백색소음 | 5분 | Lv.1 (기본) | white-noise.mp3 |
| `desk-stretch` | 책상 앞 스트레칭 | 3분 | Lv.1 (기본) | desk-stretch.mp3 |
| `meeting-calm` | 회의 후 진정 호흡 | 3분 | Lv.1 | desk-stretch.mp3 (대체) |
| `afternoon-focus` | 오후 집중 부스터 | 5분 | Lv.1 | white-noise.mp3 (대체) |
| `commute-winddown` | 퇴근길 마음 비우기 | 3분 | Lv.1 | desk-stretch.mp3 (대체) |
| `deep-sleep` | 야근 후 딥슬립 | 20분 | **Lv.3** | deep-sleep.mp3 |
| `burnout-recovery` | 번아웃 회복 명상 | 15분 | **Lv.5** | burnout-recovery.mp3 |

- 트랙 클릭 시 **음악 자동 ON + 즉시 재생** (모바일 제스처 충족)
- 레벨 미달 시 **레벨 안내 모달** 표시
- 재생 시 라이브러리 패널 안내 문구 + 미니 재생 바
- 재생 시 +10 XP (하루 1회 제한 없음, 트랙별)
- AI 세션 BGM 레벨 부족 시 대체 트랙: `burnout-recovery` → `desk-stretch`, `deep-sleep` → `white-noise`

### 5.6 감사일기 (`journal.js`)

- 매일 감사한 일 작성·수정 (하루 1건)
- 히스토리 목록 (최신순)
- 최초 저장 시 +20 XP
- 미션 완료: `dailyMissions.journal = true`

### 5.7 XP · 레벨 · Mind Energy (`progress.js`)

**XP 보상:**

| 활동 | XP | 비고 |
|------|-----|------|
| AI 스크립트 생성 | +15 | |
| 오늘의 명상 완료 | +25 | 하루 1회 |
| 감사일기 작성 | +20 | 하루 1회 (최초 저장) |
| 오디오 재생 | +10 | 트랙 클릭 시 |
| 오늘의 미션 전체 완료 | +40 | AI+호흡+일기 3종 완료 시 자동 |

**레벨 구간 (8단계):**

| Lv | 필요 XP | 칭호 |
|----|---------|------|
| 1 | 0 | 새싹 직장인 |
| 2 | 50 | 회복 루키 |
| 3 | 120 | 마음 수호자 |
| 4 | 220 | 밸런스 마스터 |
| 5 | 350 | 칼름 리더 |
| 6 | 520 | 멘탈 멘토 |
| 7 | 750 | 오피스 힐러 |
| 8 | 1050 | 평온의 달인 |

**Mind Energy Score (0~100%):**

```
기본 35
+ 스트릭 × 4 (최대 24)
+ 오늘 명상 완료 시 +18
+ 오늘 감사일기 작성 시 +15
+ 레벨 × 3 (최대 18)
+ XP 누적 보너스 floor(xp/40) (최대 10)
→ 0~100 정규화
```

- 레벨업 시 **축하 모달** (컨페티 + 짧은 차임)

### 5.8 오늘의 미션 (`missions.js`)

- 매일 3종 미션: AI 코칭 / 호흡 / 감사일기
- 3종 모두 완료 시 **+40 XP 보너스** 자동 지급
- `state.dailyMissions`에 날짜별 저장, 자정 이후 리셋

### 5.9 Settings (`settings.js`) — Sprint 03

| 메뉴 | 상태 |
|------|------|
| Profile (닉네임 변경) | ✅ 구현 |
| About (버전·캐시·실행 모드) | ✅ v2.4+ |
| Privacy / Terms | ✅ 플레이스홀더 (localStorage only 안내) |
| Notifications | 🔜 Coming Soon |
| Daily Goal | 🔜 Coming Soon |
| Theme (다크/라이트) | 🔜 Coming Soon |
| Language | 🔜 Coming Soon |

- About 패널: 앱 버전, 활성 SW 캐시, 최신 캐시, standalone 여부, 업데이트 대기 상태 표시

### 5.10 PWA (`pwa.js` + `service-worker.js` + `manifest.json`)

- **설치:** `beforeinstallprompt` 캡처 → 네이티브 `prompt()` / iOS·Android 수동 가이드
- **설치 배너:** 세션 단위 dismiss (`sessionStorage.mindly_pwa_install_dismissed_session`)
- **오프라인:** SW precache + Network-first(HTML/JS/CSS) / Cache-first(이미지·MP3)
- **자동 업데이트 (v2.2~v2.5):**
  1. `CACHE_VERSION` 변경 시 새 SW 감지
  2. 5분 주기 + 포커스 시 `registration.update()` (standalone은 1분)
  3. "새 버전이 있습니다" 상단 배너
  4. 업데이트 클릭 → `SKIP_WAITING` → `controllerchange` → 자동 `reload()`
- **v2.5:** 모바일 홈 레이아웃 stale 캐시 수정, PWA 업데이트 개선

---

## 6. 미구현 / 향후 계획

| 기능 | 상태 | 비고 |
|------|------|------|
| 실제 OpenAI API 연동 | ⏳ | 현재 프리셋 기반 가상 AI |
| Firebase 로그인·클라우드 동기화 | ⏳ | onboarding.js에 확장 지점 주석 |
| Push Notification | ⏳ | `notifications.js` 레거시, Settings UI만 Coming Soon |
| Daily Goal 설정 | ⏳ | |
| 다크/라이트 Theme | ⏳ | |
| 다국어 (i18n) | ⏳ | |
| Privacy/Terms 실제 문서 | ⏳ | 플레이스홀더만 |
| React 마이그레이션 | ⏳ | 로컬 폴더명에 React 포함, 아직 Vanilla JS |

---

## 7. 파일·모듈 맵

```
OfficeCalm_Ai/
├── index.html                  # 5탭 SPA 전체 마크업, 모달, PWA 메타
├── manifest.json               # PWA 매니페스트 (standalone)
├── service-worker.js           # CACHE_VERSION = mindly-v2.5
├── package.json                # npm start → npx serve . -l 3000
├── css/style.css               # 전체 스타일 (640px 모바일 앱 레이아웃)
├── js/
│   ├── version.js              # APP_VERSION, SW_CACHE_VERSION 단일 소스
│   ├── pwa.js                  # SW 등록, 설치 배너, 업데이트 감지
│   ├── ai-engine.js            # AI 프리셋 스크립트, 타이핑 효과
│   ├── audio-player.js         # MP3 재생, 음악 토글, 미니 플레이어
│   ├── level-gate.js           # 레벨 기반 콘텐츠 잠금 모달
│   ├── gallery.js              # 브리드 탭 힐링 이미지 갤러리
│   ├── progress.js             # XP, 레벨, Mind Energy, 레벨업 UI
│   ├── journal.js              # 감사일기 CRUD, 히스토리
│   ├── missions.js             # 오늘의 미션 추적, +40XP 보너스
│   ├── onboarding.js           # 닉네임 온보딩, 시간대 인사
│   ├── settings.js             # Settings 화면, About 버전 패널
│   ├── tabs.js                 # 5탭 전환, sessionStorage 저장
│   ├── notifications.js        # 알림 (레거시, 홈 UI에서 제거됨)
│   └── app.js                  # 진입점: 상태 로드/저장, 모듈 초기화, 이벤트 바인딩
├── assets/
│   ├── audio/                  # MP3 4종 + CREDITS.txt
│   ├── icons/                  # icon-192.png, icon-512.png
│   └── images/                 # care.png, calm-01~06.jpg
└── docs/
    ├── GPT_PROJECT_CONTEXT.md  # ← 이 문서
    ├── PROJECT_STATUS.md       # v2.2 기준 (일부 구버전)
    ├── UX_IMPROVEMENT_v1.md
    └── SPRINT_03_SETTINGS.md
```

### 스크립트 로드 순서 (`index.html`)

```
version.js → pwa.js (defer)
→ ai-engine → level-gate → audio-player → gallery
→ onboarding → missions → progress → journal → tabs
→ settings → app.js
```

`app.js`가 마지막에 실행되어 모든 `OC.init*` 함수를 호출합니다.

---

## 8. 데이터 스키마 (Storage Keys)

### localStorage

| Key | 용도 | 관리 모듈 |
|-----|------|-----------|
| `officeCalm_user_state` | XP, 레벨, streak, 감사일기, 미션 등 핵심 상태 | `app.js` |
| `nickname` | 사용자 닉네임 | `onboarding.js` |
| `mindly_last_preset` | 마지막 AI 프리셋 키 (브리드 추천용) | `app.js` |
| `officeCalm_notifications` | 알림 설정 (레거시) | `notifications.js` |
| `mindly_pwa_install_dismissed` | PWA 설치 배너 영구 dismiss | `pwa.js` |

### `officeCalm_user_state` JSON 구조

```json
{
  "streak": 3,
  "lastCompletedDate": "2026-07-13",
  "xp": 85,
  "level": 2,
  "mindEnergy": 68,
  "lastJournalDate": "2026-07-13",
  "gratitudeJournal": [
    {
      "date": "2026-07-13",
      "text": "동료가 커피를 사줘서 힘이 났어요",
      "createdAt": "2026-07-13T12:00:00.000Z"
    }
  ],
  "snapshotMindEnergy": null,
  "snapshotMindEnergyDate": null,
  "dailyMissions": {
    "date": "2026-07-13",
    "aiCoaching": false,
    "breathe": false,
    "journal": false,
    "bonusClaimed": false
  }
}
```

### sessionStorage

| Key | 용도 |
|-----|------|
| `officeCalm_active_tab` | 마지막 선택 탭 ID |
| `mindly_pwa_install_dismissed_session` | 이번 세션 PWA 설치 배너 dismiss |
| `mindly_sw_reload_*` | SW 업데이트 후 중복 reload 방지 |

---

## 9. 핵심 로직 흐름

### 9.1 앱 초기화 (`app.js`)

```
DOMContentLoaded
  → loadUserState() from localStorage
  → OC.initOnboarding()
  → OC.initTabs()
  → OC.initProgress()
  → OC.initLevelGate()
  → OC.initAudioPlayer()
  → OC.initGallery()
  → OC.initJournal()
  → OC.initMissions()
  → OC.initSettings()
  → OC.initAiEngine()
  → UI 동기화 (스탯, 인사, 미션, 브리드 추천)
```

### 9.2 AI 세션 → BGM 매핑

| AI 프리셋 | 자동 BGM 트랙 |
|-----------|---------------|
| meeting | white-noise |
| commute | desk-stretch |
| boss / overtime / custom | burnout-recovery |

조건: **홈 탭에서 음악 ON** 상태일 때만 AI BGM 재생.

### 9.3 음악 재생 규칙

- **라이브러리:** 트랙 클릭 → 음악 자동 ON + 재생 (홈 이동 불필요)
- **AI:** 음악 ON일 때만 BGM, OFF면 플레이어 UI 숨김 (`hidden` + CSS)
- **미니 플레이어:** 홈·라이브러리 양쪽 UI 동기화

### 9.4 PWA 업데이트 흐름

```
배포 (CACHE_VERSION 변경)
  → 클라이언트 update() (5분/포커스/standalone 1분)
  → 새 SW installed + 기존 SW 활성
  → 상단 배너 "새 버전이 있습니다"
  → 사용자 "업데이트" 클릭
  → SKIP_WAITING → controllerchange → location.reload()
```

---

## 10. Sprint & Git 히스토리 요약

| Sprint | 주제 | 상태 |
|--------|------|------|
| Sprint 01 | 5탭 레이아웃 · Mindly 리브랜드 | ✅ |
| Sprint 02 | UX v1 (온보딩·Hero·미션·PWA) | ✅ |
| Sprint 03 | Settings 기능 | ✅ |
| Sprint 04 | PWA 업데이트 자동 감지 | ✅ |
| v2.4 | PWA 설치 배너 지속성, About 버전 패널 | ✅ |
| v2.5 | 모바일 홈 캐시 수정, PWA 업데이트 개선 | ✅ (현재) |

**최근 커밋 (최신순):**

```
974f94c Fix stale mobile home layout cache and improve PWA update (v2.5)
21f15b4 Fix PWA install banner persistence and add About version panel (v2.4)
4d8ad82 Fix installed PWA auto-update: aggressive checks and standalone auto-apply
5e40d71 Add PWA auto-update detection and refresh all docs to v2.2
31053a0 Reorder home layout: brand and stats above hero card
```

---

## 11. 배포 & 버전 관리

배포 시 **반드시 함께 변경:**

1. `js/version.js` — `APP_VERSION`, `SW_CACHE_VERSION`
2. `service-worker.js` — `CACHE_VERSION` (version.js와 동일 값)
3. `index.html` — `?v=` 쿼리스트링 (선택, 캐시 버스팅)

GitHub Actions (`.github/workflows/pages.yml`): `main` push 시 GitHub Pages 자동 배포.

---

## 12. AI vs 라이브러리 역할 (중요)

| | AI 스트레스 관리실 | 콘텐츠 라이브러리 |
|--|-------------------|-------------------|
| 목적 | 맞춤 코칭 스크립트 + 브리드 유도 | 배경음·효과음 재생 |
| 예시 | 「회의 5분 전」→ 긴 코칭 텍스트 | 「사무실 백색소음」→ 5분 사운드 |
| 출력 | AI 출력창 (타이핑) | 라이브러리 패널 안내 문구 |
| BGM | 홈 음악 ON 시 자동 | 트랙 클릭 시 자동 ON+재생 |

---

## 13. 개발 시 주의사항

1. **SQLite/백엔드 없음** — 모든 상태는 localStorage. 서버 API 호출 코드 없음.
2. **모듈 간 결합** — `app.js`가 콜백으로 XP·미션·저장을 연결. 새 기능 추가 시 `OC` 네임스페이스 패턴 유지.
3. **GitHub Pages base path** — `index.html` head에 `github.io` 서브패스용 `<base>` 태그 자동 삽입.
4. **file:// 프로토콜** — 로컬 더블클릭 실행 가능하나 SW·일부 API 제한. `npm start` 권장.
5. **문서 버전 불일치** — `PROJECT_STATUS.md`, `OfficeCalm_AI_Specification.md`는 v2.2 기준. **이 문서(v2.5)가 최신 구현 기준.**

---

## 14. GPT에게 작업 요청 시 권장 프롬프트

```
이 프로젝트는 Mindly(OfficeCalm_Ai) PWA 웹앱입니다.
docs/GPT_PROJECT_CONTEXT.md를 먼저 읽고 현재 구현 상태를 파악한 뒤 작업해 주세요.

[작업 내용을 여기에 작성]
```

---

## 15. 관련 문서

| 파일 | 설명 |
|------|------|
| `README.md` | 사용자·개발자용 메인 문서 |
| `OfficeCalm_AI_Specification.md` | 상세 기능·UI 명세 (v2.2) |
| `docs/PROJECT_STATUS.md` | Sprint 현황 (v2.2) |
| `docs/UX_IMPROVEMENT_v1.md` | UX 개선 기록 |
| `docs/SPRINT_03_SETTINGS.md` | Settings Sprint 상세 |

---

*이 문서는 2026-07-13 로컬 클론 시점의 실제 코드베이스를 기준으로 작성되었습니다.*
