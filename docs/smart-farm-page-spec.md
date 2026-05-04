# Smart Farm PWA — 페이지별 기능 명세

> **범위:** 수집된 스마트팜 기능을 화면별로 정리한다. **UI 구현은 본 문서 범위에 포함하지 않는다.**  
> **UI 라벨:** 한국어 · **코드/파일/라우트명:** 영어 · **데이터:** 현재·향후 모두 목업 기준, 실 API 미연동.

---

## 공통

| 항목 | 내용 |
|------|------|
| 앱 셸 | `app/(control)/layout.tsx` — `ControlCenterShell`, 사이드바·모바일 스트립 내비 |
| 내비 정의 | `lib/navigation/control-nav-links.ts` — 한글 라벨 · 경로는 영어 |
| 목업 데이터 | `lib/dashboard/mock-data.ts`, `lib/dashboard/types.ts` |
| 스타일 | 모던 블루 산업 IoT / SaaS형 서피스 (`sf-surface` 등) |

### 페이지·라우트·한글 내비 라벨

| # | 경로 (English) | UI 라벨 (한국어) |
|---|----------------|------------------|
| 1 | `/dashboard` | 실시간 모니터링 |
| 2 | `/cameras` | 카메라 |
| 3 | `/auto-manual` | 자동/수동 |
| 4 | `/sensors` | 센서 |
| 5 | `/devices` | 장비 |
| 6 | `/alarms-work` | 알람/작업 |
| 7 | `/auction` | 경매 |
| 8 | `/settings` | 설정 |

---

## 1. Dashboard — 실시간 모니터링 (`/dashboard`)

### 목적 (Purpose)

- 농장·온실·환경·알람 **요약만** 제공하는 운영 개요 화면.
- 상세 카메라·차트·구동기 설정은 해당 페이지로 분리.

### 표시 항목 (Display items)

| 한글 영역 | 내용 |
|-----------|------|
| 시설 요약 | 농장명, 전체 상태(정상/주의/점검 필요), 목업 텔레메트리 안내 |
| 지표 타일 | 전체, 자동 존 수, 수동 존 수, 알람(미처리 합), 장비(온라인 수) |
| 온실 카드 | 존명, 작물, 온도·습도, 자동/수동, 관수·천창·측면 상태, 수동 제어(목업) |
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

## 3. Auto/Manual Control — 자동/수동 (`/auto-manual`)

### 목적 (Purpose)

- **상위 모드**(플릿/존 자동·수동 정책), 스케줄·자동화 규칙 진입.
- 개별 모터·릴레이 **현장 디테일 제어**는 장비 페이지와 역할 분리.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| 상위 제어 모드 | 자동 / 수동 선택(목업), 설명 문구 |
| 스케줄 | 편집기 플레이스홀더 |
| 자동화 규칙 | 규칙 엔진 플레이스홀더 |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| 자동·수동 전환 | 목업 상태 토글 |
| 스케줄·규칙 편집 | 미구현 · 향후 CRUD |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 플릿 모드 등 | 컴포넌트 로컬 state 또는 향후 `MOCK_SUPERVISORY_MODE` 도입 |

### 향후 API (Future API requirements)

- `PATCH /fleet/mode` 또는 `PATCH /zones/{id}/mode`
- `GET/POST/PUT /schedules`
- `GET/POST/PUT /automation-rules`

### 개발 우선순위 (Development priority)

- **P1** — 모드·스케줄·규칙 데이터 모델 분리

---

## 4. Sensors — 센서 (`/sensors`)

### 목적 (Purpose)

- 시계열·차트·관측 채널 상세, **대표 센서·임계 설정**(향후).
- 대시보드 환경 블록은 요약만; 본 페이지는 탐색·설정 중심.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| (현재) 플레이스홀더 | 안내 문구만 |
| (향후) 차트 영역 | 시계열 목업 |
| (향후) 채널 목록 | 이름·위치·현재값 |
| (향후) 임계 설정 | 알람 규칙과 연계 가능 |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| 기간·채널 선택 | 미구현 |
| 임계 저장 | 미구현 → API 후 |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 시계열 | 향후 `MOCK_SENSOR_SERIES` 또는 기존 `MOCK_CLIMATE_SENSORS` 확장 |
| 채널 메타 | `MOCK_CLIMATE_SENSORS` 재사용 가능 |

### 향후 API (Future API requirements)

- `GET /sensors`, `GET /sensors/{id}`
- `GET /sensors/{id}/readings?from=&to=&resolution=`
- `PUT /sensors/{id}/thresholds`

### 개발 우선순위 (Development priority)

- **P2** — 차트 라이브러리·시계열 API 확정 후

---

## 5. Devices — 장비 (`/devices`)

### 목적 (Purpose)

- 관수·천창·측면창·팬·릴레이 등 **액추에이터·회선** 단위 제어 (목업 토글).
- 자동/수동 화면은 정책; 본 페이지는 **현장 장비 제어**.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| 관수 / 천창 / 측면창 | 구역별 토글 그룹(목업) |
| 팬 | 가동 토글 |
| 릴레이 | R1–R4 토글 |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| ON/OFF·열림/닫기 | 로컬 목업 |
| (향후) 명령 결과·인터록 | 서버 검증 |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 장비 상태 | 컴포넌트 로컬 state · 향후 `MOCK_ACTUATORS` |

### 향후 API (Future API requirements)

- `GET /actuators`, `POST /actuators/{id}/command`
- `GET /relays`, `POST /relays/{id}/set`

### 개발 우선순위 (Development priority)

- **P1** — 장비 타입·존 매핑 후 Auto/Manual과 문서 정합

---

## 6. Alarms & Work — 알람/작업 (`/alarms-work`)

### 목적 (Purpose)

- 알람 목록·작업 지시(워크 오더) 운영 큐.
- 알람 **규칙 등록** UI는 본 페이지 또는 설정과 **한곳에 일원화** 권장.

### 표시 항목 (Display items)

| 한글 | 내용 |
|------|------|
| 알람 목록 | 시간, 심각도, 유형, 메시지, 온실명 |
| 작업 지시 | 작업 유형, 온실, 지시 문구, 마감, 상태(대기/진행/완료) |

### 조작 (Control actions)

| 동작 | 비고 |
|------|------|
| 목록 스크롤 | 현재 |
| 알람 확인·작업 상태 변경 | 향후 |
| 규칙 CRUD | 향후 · 설정과 역할 분리 |

### 필요 목업 데이터 (Mock data needed)

| 데이터 | 출처 |
|--------|------|
| 알람 | `MOCK_ALARMS` |
| 작업 지시 | `MOCK_WORK_INSTRUCTIONS` |

### 향후 API (Future API requirements)

- `GET /alarms`, `PATCH /alarms/{id}/ack`
- `GET /work-instructions`, `PATCH /work-instructions/{id}`
- `GET/POST/PUT /alarm-rules`

### 개발 우선순위 (Development priority)

- **P1** — 목록 UX · **P2** — 규칙 편집 위치·API

---

## 7. Auction — 경매 (`/auction`)

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

## 8. Settings — 설정 (`/settings`)

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
| 대시보드 뷰 | `components/dashboard/dashboard-shell.tsx`, `farm-overview.tsx`, `greenhouse-grid.tsx`, `environment-section.tsx`, `environment-compare.tsx`, `latest-alarm.tsx` |
| 카메라 페이지 | `app/(control)/cameras/page.tsx` |
| 자동/수동 | `app/(control)/auto-manual/page.tsx`, `components/auto-manual/auto-manual-panel.tsx` |
| 센서 | `app/(control)/sensors/page.tsx` |
| 장비 | `app/(control)/devices/page.tsx`, `components/devices/fleet-device-controls.tsx` |
| 알람/작업 | `app/(control)/alarms-work/page.tsx`, `recent-alarms.tsx`, `work-instructions.tsx` |
| 목업 | `lib/dashboard/mock-data.ts`, `lib/dashboard/types.ts` |

---

## 전체 개발 우선순위 요약

| 순위 | 범위 |
|------|------|
| **P0** | Dashboard 요약 전용, 내비·목업 일관성 |
| **P1** | Cameras·Devices·Auto-Manual·Alarms 목록/제어 스코프 |
| **P2** | Sensors 차트·임계, Settings, 알람 규칙 UI |
| **P3** | Auction |

---

*API 경로는 백엔드 설계 시 변경 가능. 본 문서는 기능 스코프 합의용이다.*
