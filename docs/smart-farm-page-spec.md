# Smart Farm PWA — 페이지별 기능 명세

> **범위:** 수집된 스마트팜 기능을 화면별로 정리한다. **UI 구현은 본 문서 범위에 포함하지 않는다.**  
> **UI 라벨:** 한국어 · **코드/파일/라우트명:** 영어 · **데이터:** 현재·향후 모두 목업 기준, 실 API 미연동.

## 설계 원칙 (간결·기능 완결)

| 원칙 | 설명 |
|------|------|
| 한 화면 과부하 금지 | 상세 기능은 전용 페이지로 분리 |
| 대시보드 | 온실·링크 수준의 **요약만** (카메라·날씨는 한 단계 축약 요약 + 상세 페이지 이동) |
| 온실 상세 | 해당 동의 센서·알람·구동·차트 |
| 장비 | 양액공급·플릿 구동·동별 수동 (목업) |
| 작업 | 지시·일지·사진·AI 보고·제어 초안 |
| 알람 | 목록 + 규칙 요약(목업) |
| 날씨 | 3일 시간대별 예보 |
| 설정 | 농장·PLC·DDNS·카메라·사용자·알림 placeholder |

### 안전

- **AI는 제어를 직접 실행하지 않는다.** 초안·보고는 참고용.
- **PLC/장비 명령**은 확인 대화상자(목업)를 거친다.
- **양액공급·온풍기**는 추가 확인(체크) 후 실행 가능하도록 UI 분리.

---

## 공통

| 항목 | 내용 |
|------|------|
| 앱 셸 | `app/(control)/layout.tsx` — `ControlCenterShell`, 사이드바·모바일 스트립 내비 |
| 내비 정의 | `lib/navigation/control-nav-links.ts` — 한글 라벨 · 경로는 영어 |
| 목업 데이터 | `lib/dashboard/mock-data.ts`, `lib/dashboard/types.ts`, `lib/devices/mock-data.ts`, `lib/devices/types.ts` |
| 스타일 | 모던 블루 산업 IoT / SaaS형 서피스 (`sf-surface` 등) |

### 페이지·라우트·한글 내비 라벨

| # | 경로 (English) | UI 라벨 (한국어) |
|---|----------------|------------------|
| 1 | `/dashboard` | 대시보드 |
| 2 | `/cameras` | 카메라 |
| 3 | `/devices` | 장비 |
| 4 | `/alarms` | 알람 |
| 5 | `/work` | 작업 |
| 6 | `/weather` | 날씨 |
| 7 | `/auction` | 경매 |
| 8 | `/settings` | 설정 (농장·PLC·DDNS·카메라·사용자·알림 placeholder) |

구 경로(호환): `/auto-manual` → `redirect` 로 `/devices` · `/sensors` → `/dashboard`.

---

## 1. Dashboard — 실시간 모니터링 (`/dashboard`)

### 목적 (Purpose)

- 농장·온실·환경·알람 **요약만** 제공하는 운영 개요 화면.
- 상세 카메라·차트·구동기 설정은 해당 페이지로 분리.

### 표시 항목 (Display items)

| 한글 영역 | 내용 |
|-----------|------|
| 지표 타일 | 전체, 자동 존 수, 수동 존 수, 알람(미처리 합), 장비(온라인 수) |
| 온실 카드 | 존명, 작물, 온도·습도, 자동/수동, 관수·천창·측창 상태, 수동 제어(목업) |
| 환경 비교 | 실외·오늘 vs 기후 센서 행 정렬 비교, 3일 예보 스트립 |
| 최근 알람 | 1건, 심각도, 알람/작업 페이지 링크 |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| 타 페이지 이동 | 내비게이션 |
| 온실 카드 토글 | 로컬 목업만; 연동 시 서버 명령은 Devices 등과 정책 통합 검토 |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처(예상 타입/상수) |
|--------|----------------------|
| 농장 메타 | `MOCK_FARM_META` |
| 온실 존 목록 | `MOCK_GREENHOUSES` |
| 날씨·실외 습도 | `MOCK_WEATHER` (오늘 행에 습도 필드) |
| 기후 센서 | `MOCK_CLIMATE_SENSORS` |
| 최근 알람 | `MOCK_LATEST_ALARM` ← `MOCK_ALARMS` |

### 향후 API (Future API requirements)

- `GET /farms/{id}/summary` — 상단 집계
- `GET /zones?fields=summary` — 온실 카드 요약 필드
- `GET /alarms/open/count` 또는 요약에 포함
- `GET /weather/today`, `GET /sensors` — 환경 비교 스냅샷
- `GET /alarms/latest`

### 개발 우선순위 (Development priority)

- **P0** — 요약 전용 범위 유지, 다른 페이지와 책임 중복 방지

---

## 2. Cameras — 카메라 (`/cameras`)

### 목적 (Purpose)

- 카메라별 상태·해상도·스트림·AI 검출 **표시 영역**을 한 화면에 모음 (연동 전 플레이스홀더).

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| 카메라 카드 | 이름, 상태(온라인/저하/오프라인), 해상도 |
| 스트림 영역 | RTSP 미연동 안내·플레이스홀더 |
| AI 영역 | 검출 상태 텍스트(목업) |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| (향후) 스트림·PTZ 등 | API 확정 후 |
| 현재 | 조작 없음·표시만 |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 카메라 목록 | `MOCK_CAMERAS` |

### 향후 API (Future API requirements)

- `GET /cameras`
- `GET /cameras/{id}/stream-session` — 재생 URL·토큰
- `GET /cameras/{id}/ai-summary`

### 개발 우선순위 (Development priority)

- **P1** — 목록·상태 고정 후 스트림 연동

---

## 3. Auto/Manual — 통합 안내 (독립 라우트 없음)

- **내비에서 제거.** 이전 `/auto-manual` 은 **`/devices` 로 redirect** (호환).
- **자동/수동 모드** 및 **전체·동별 구동**은 아래 **§5 Devices** 에서 목업으로 처리.
- 스케줄·온실별 세부 구동 UI는 **`/greenhouses/[id]`** 온실 상세(구동 제어 카드)와 병행.

---

## 4. Sensors — 통합 안내 (독립 목록 페이지 없음)

- **내비에서 제거.** 이전 `/sensors` 는 **`/dashboard` 로 redirect** (호환).
- **센서 요약·환경 비교**는 대시보드(`environment-section` 등).
- **센서 추세·알람 임계**는 온실 상세(`greenhouse-detail-shell`, `SensorSummary`, 추세 패널 등).

### 향후 API (Future API requirements)

- `GET /sensors`, `GET /sensors/{id}/readings?...` 등은 온실·대시보드 위젯 소비 형태로 재사용.

---

## 5. Devices — 장비 · 구동 센터 (`/devices`)

### 목적 (Purpose)

- **전장(7동) 수동/자동 제어 허브**: 플릿 일괄 + 온실별 패널.
- 관수·천창·측창·유동팬·온풍기·분무기 ON/OFF(또는 열기/닫기) — **목업 로컬 state 만** 갱신.
- 자동 모드 동에서도 수동 버튼은 표시하되 **주의(시각적 경고)** 안내.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| 전체 제어 | 전체 자동/수동, 전체 관수·천창·측창·유동팬·온풍기·분무기 |
| 온실 패널(×7) | 동명, 작물, 종합 상태, 현재 모드(자동/수동), 모드 선택, 구동 행, 마지막 명령 시각·요약 |
| 전체 마지막 명령 | 일괄 조작 시 타임스탬프·요약 문구 |

### 양액공급 UI (감독 전용)

- **웹은 감독(supervisory)만**: 상태·현재 EC/pH(측정 표시), 현재/선택 레시피, 공급 대상, 자동/수동 모드 요청, 공급 시작·중지(확인), 최근 공급 이력 요약, PLC 연결, PLC 화면 열기(placeholder).
- **웹에서 다루지 않음**: 상세 EC/pH 제어 로직, 펌프·탱크 시퀀스, 인터록 — **양액 PLC·터치 패널**에만 둔다.
- 구현: `components/devices/nutrient-solution-panel.tsx`, `lib/devices/nutrient-types.ts`, `lib/devices/nutrient-mock-data.ts`.

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| 모드·구동 토글 | 로컬 state; 고위험 일괄(관수 ON, 천창/측창 열기, 온풍기/분무기 ON 등)는 확인 대화상자(목업) |
| 온실 상세 이동 | 패널 제목 링크 → `/greenhouses/[id]` |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 초기 7동 스냅샷 | `MOCK_GREENHOUSES`, `MOCK_GREENHOUSE_FAN_ACTUATORS` → `buildInitialDeviceRows()` (`lib/devices/mock-data.ts`) |

### 주요 UI 컴포넌트 (코드)

- `components/devices/devices-page-shell.tsx` — 페이지 상태·확인창
- `components/devices/global-control-panel.tsx` — 전체 제어
- `components/devices/greenhouse-device-panel.tsx` — 동별 카드
- `components/devices/device-control-button.tsx`, `mode-selector.tsx`, `devices-confirm-dialog.tsx`
- `components/devices/nutrient-solution-panel.tsx` — 양액 감독(목업)

### 향후 API (Future API requirements)

- `PATCH /fleet/mode`, `PATCH /zones/{id}/mode`
- `POST /zones/{id}/actuators/{kind}/command` 또는 통합 명령 API
- `GET /zones/{id}/actuator-state`

### 개발 우선순위 (Development priority)

- **P1** — 실연동 시 명령 큐·인터록·권한과 정합

### 레거시 참고

- `components/devices/fleet-device-controls.tsx` — 초기 프로토타입(릴레이 뱅크 등); 현재 메인 UX는 위 셸·패널 구조.

---

## 6. Alarms & Work — 알람 · 작업 (`/alarms`, `/work`)

### 목적 (Purpose)

- 알람 목록·작업 지시(워크 오더) 운영 큐.
- **`/work`** 에서 **농사일지(Farm Diary)** 를 구조화 입력층으로 포함한다. 일지는 단순 메모가 아니라 향후 AI 분석·제어 명령 생성의 **정형 입력 소스**로 설계한다.
- 알람 **규칙 등록** UI는 본 페이지 또는 설정과 **한곳에 일원화** 권장.

### `/work` 페이지 구조 (탭)

| 탭 (한글) | 역할 |
|-----------|------|
| 작업할 업무 | 기존 작업 지시 큐 (`MOCK_WORK_INSTRUCTIONS`) |
| 농사일지 | 구조화 일지 입력·목록·필터·상세 (목업 로컬 state) |
| AI 운영보고 | 일지 요약 기반 **참고용** 모의 보고 (실 AI 미연동) |
| 제어명령 초안 | AI가 생성했다고 가정하는 **설정 초안** 카드. **실행 금지·초안만**. 사람 승인 전까지 PLC/API 미반영 |

### 안전·정책

- **AI는 제어를 직접 실행하지 않는다.** 제어명령 초안은 항상 초안 상태이며, 승인·현장 확인 후 별도 실행 계층에서만 반영한다 (현재 UI는 목업).
- **AI 운영보고는 참고용**이며 자동 조치를 수행하지 않는다.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| 알람 목록 (`/alarms`) | 시간, 심각도, 유형, 메시지, 온실명 |
| 작업 지시 | 작업 유형, 온실, 지시 문구, 마감, 상태(대기/진행/완료) |
| 농사일지 | 날짜·시간·온실·작물·작업 유형·내용·작업자·센서/장비 태그·중요도·AI 분석 플래그 등 |
| 제어명령 초안 | 대상 온실·장비·제안 명령·이유·관련 일지·센서 스냅샷·위험도·실행 상태(초안/승인 등 목업) |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| 목록 스크롤 | 현재 |
| 알람 확인·작업 상태 변경 | 향후 |
| 규칙 CRUD | 향후 · 설정과 역할 분리 |
| 일지 등록·필터·상세 보기 | 목업 로컬 상태만 갱신 |
| 초안 승인/보류/거부/명령 수정 | 목업 상태만; 실 PLC 미연동 |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 알람 | `MOCK_ALARMS` |
| 작업 지시 | `MOCK_WORK_INSTRUCTIONS` |
| 농사일지·AI 보고·제어 초안 | `lib/work/mock-data.ts`, 타입 `lib/work/types.ts` |

### 향후 API (Future API requirements)

- `GET /alarms`, `PATCH /alarms/{id}/ack`
- `GET /work-instructions`, `PATCH /work-instructions/{id}`
- `GET/POST/PUT /alarm-rules`
- 농사일지: `GET /farm-diary`, `POST /farm-diary`, `PUT /farm-diary/{id}`, `DELETE /farm-diary/{id}`
- AI(향후): `POST /ai/analyze-diary`, `GET /ai/control-order-drafts`, `PATCH /ai/control-order-drafts/{id}/approve`, `PATCH .../hold`, `PATCH .../reject`

플레이스홀더 함수·경로 상수: `lib/work/api-placeholders.ts` (현재 호출 없음).

### 개발 우선순위 (Development priority)

- **P1** — 목록 UX · **P2** — 규칙 편집 위치·API · 일지·AI 백엔드 연동 시 `api-placeholders` 대체

---

## 7. Weather — 날씨 (`/weather`)

### 목적 (Purpose)

- 실외·시간대별 예보 요약(목업).

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 예보 | `MOCK_WEATHER`, `MOCK_WEATHER_HOURLY` 등 (`lib/dashboard/mock-data.ts`) |

---

## 8. Auction — 경매 (`/auction`)

### 목적 (Purpose)

- 출하·경매 연동 **예약** 화면; 도메인 확정 전 플레이스홀더.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| 안내 | 연동 예정 문구 |

### 조작 (Control actions)

- 없음 (향후 목록·입찰 등)

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| (향후) 경매 목록 | `MOCK_AUCTIONS` 등 도입 시 |

### 향후 API (Future API requirements)

- 도메인 확정 후 별도 설계 (예: `GET /listings`, 주문 API)

### 개발 우선순위 (Development priority)

- **P3**

---

## 9. Settings — 설정 (`/settings`)

### 목적 (Purpose)

- 농장 프로필, 알림, 외부 연동, **전역 알람·규칙(선택)**.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| (현재) 플레이스홀더 | 프로필·연동·알림 예정 안내 |
| (선택) 알람 규칙 | Alarms & Work와 중복 없이 배치 |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| 저장·연결 테스트 | 향후 |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 설정 객체 | 향후 `MOCK_FARM_SETTINGS` |

### 향후 API (Future API requirements)

- `GET/PUT /farm/settings`
- `GET/PUT /users/notification-preferences`
- `GET/PUT /integrations/*`
- 알람 규칙 API는 Alarms 절과 공유

### 개발 우선순위 (Development priority)

- **P2** — 프로필·알림 후 연동·규칙

---

## 부록: 주요 코드 파일 (English names)

| 역할 | 파일 예시 |
|------|-----------|
| 대시보드 뷰 | `components/dashboard/dashboard-shell.tsx`, `greenhouse-grid.tsx`, `environment-section.tsx`, `environment-compare.tsx`, `latest-alarm.tsx` |
| 온실 상세·구동 스케줄(목업) | `app/(control)/greenhouses/[id]/page.tsx`, `components/greenhouse/greenhouse-detail-shell.tsx`, `components/dashboard/control-button-group.tsx`, `operation-schedule-modal.tsx`, `lib/greenhouse/types.ts` |
| 카메라 페이지 | `app/(control)/cameras/page.tsx` |
| 자동/수동(redirect) | `app/(control)/auto-manual/page.tsx` → `/devices` |
| 센서(redirect) | `app/(control)/sensors/page.tsx` → `/dashboard` |
| 장비 · 구동 센터 | `app/(control)/devices/page.tsx`, `components/devices/devices-page-shell.tsx`, `global-control-panel.tsx`, `greenhouse-device-panel.tsx`, `lib/devices/*` |
| 알람·작업 | `app/(control)/alarms/page.tsx`, `app/(control)/work/page.tsx`, `components/work/work-page-shell.tsx`, `components/work/farm-diary-*.tsx`, `components/work/ai-operation-report.tsx`, `components/work/control-order-*.tsx`, `lib/work/*` (및 `alarms-work` 레거시 라우트가 있으면 별도) |
| 날씨 | `app/(control)/weather/page.tsx` |
| 자동/수동 UI(레거시 컴포넌트) | `components/auto-manual/auto-manual-panel.tsx` (필요 시 재사용) |
| 목업 | `lib/dashboard/mock-data.ts`, `lib/dashboard/types.ts` |

---

## 전체 개발 우선순위 요약

| 순위 | 범위 |
|------|------|
| **P0** | Dashboard 요약 전용, 내비·목업 일관성 |
| **P1** | Cameras·Devices(구동 허브)·Alarms/Work 목록/제어 스코프 |
| **P2** | 온실 상세 센서 차트·임계, Settings, 알람 규칙 UI |
| **P3** | Auction |

---

*API 경로는 백엔드 설계 시 변경 가능. 본 문서는 기능 스코프 합의용이다.*
