# 스마트팜 Farm PC REST API 명세

> **범위:** 본 문서는 **현재 저장소에 구현된** 백엔드(Delphi 모의 서버)와 프런트(`smart-farm-pwa/lib/api`)가 사용하는 경로만 기술합니다.  
> **저장소:** 백엔드 참조 구현 `farm-pc-mock-server/` · 라우팅 `uFarmRoutes.pas` · 상태 `uFarmMockState.pas` · HTTP `uFarmHttpServer.pas`  
> **저장:** 데이터베이스 없음 — **프로세스 메모리(`TFarmMockState`)** 만 사용합니다.  
> **PLC:** 직접 연동 없음 — `uPlcDriverStub`만 존재하며, 향후 여기서 실제 PLC 계층으로 치환합니다.

---

## 1. 아키텍처

```
Next.js PWA  ── REST JSON (HTTP/HTTPS) ──▶  Farm PC API 서버 (Delphi)
                                                  │
                                                  └── (향후) PLC / 필드 장비
```

| 원칙 | 설명 |
|------|------|
| 단일 진입 | **UI는 PLC에 직접 접속하지 않습니다.** 모든 호출은 Farm PC API만 대상으로 합니다. |
| 백엔드 역할 | REST 수신, 메모리 상태 갱신, (향후) PLC 브리지와의 통신. |
| 고위험 제어 | 관수·양액·히터·개폐 등 POST 명령은 **현장 확인 후** 호출하는 것을 전제로 합니다. |

---

## 2. 공통

| 항목 | 값 |
|------|-----|
| Base URL (개발 예) | `http://localhost:8080` |
| API prefix | `/v1` |
| 인코딩 | UTF-8 JSON |
| CORS | `Access-Control-Allow-Origin: *` 등 (Delphi 서버가 응답에 부여) |
| Preflight | `OPTIONS *` → HTTP **204**, 본문 없음 |

### 2.1 성공 응답

- 일반: HTTP **200**, 본문은 아래 각 절의 JSON.
- 삭제 등: HTTP **204**, 본문 없음.

### 2.2 오류 응답 (현재 Delphi 동작)

- 미등록 라우트 등: HTTP **404**, 본문 예:

```json
{
  "error": "no route: GET /v1/unknown"
}
```

- 그 외 처리 실패 시에도 `{"error":"..."}` 형태의 JSON 객체가 반환될 수 있습니다.

> 클라이언트(`lib/api/api-client.ts`)는 네트워크 실패 시 별도의 클라이언트 측 오류 객체를 사용합니다. 서버가 표준화된 `{ "error": { "code", "message" } }` 형태로 진화하면 문서와 함께 맞추면 됩니다.

---

## 3. 엔드포인트 일람 (구현 기준)

아래 표에 **없는 경로는 구현되어 있지 않습니다.**

### Farm · 시스템

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/v1/farm/status` | 농장 요약 |
| `GET` | `/v1/system/status` | API·PLC 브리지 등 시스템 상태 |
| `GET` | `/v1/greenhouses` | 온실 목록(요약). 각 항목: `id`, `name`(표시 이름), `cropName`, `crop`(`cropName`과 동일·호환) |

### Greenhouses

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/v1/greenhouses/{greenhouseId}` | 온실 상세 |
| `GET` | `/v1/greenhouses/{greenhouseId}/status` | 온실 상태(현재 구현은 상세와 동일 계열 데이터) |
| `PATCH` | `/v1/greenhouses/{greenhouseId}` | 표시 이름·작목 갱신(메모리 저장) |
| `PATCH` | `/v1/greenhouses/{greenhouseId}/mode` | 운전 모드 변경 |

**PATCH 본문 예 (`/mode`)**

```json
{
  "mode": "MANUAL"
}
```

**PATCH 본문 예 (`/{greenhouseId}` — 프로필)**

`name`·`cropName` 중 **하나 이상** 필수. 값은 **공백만 불가**.

```json
{
  "name": "제1동",
  "cropName": "쪽파"
}
```

### Sensors

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/v1/sensors/latest` | 최신 센서 readings 일괄 |
| `GET` | `/v1/greenhouses/{greenhouseId}/sensors` | 온실별 readings |
| `GET` | `/v1/sensors/{sensorId}/history` | 이력 (`Query`: 아래 참고) |

**Query (`history`)**

| 이름 | 값 | 설명 |
|------|-----|------|
| `range` | `1h` \| `24h` \| `7d` \| `30d` | 예: `?range=24h` |

### Climate (부지 기상)

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/v1/climate/sensors` | 부지 기상탑(단일 스테이션) 관측값 — 응답은 `{ "station": { ... } }` |

`station` 객체 필드: `id`, `name`, `location`, `tempC`, `humidityPct`, `dewpointC`, `batteryPct`, `windMs`, `windDirLabel`, `solarRadiationWm2`, `rainfallMm`, `measuredAt`(ISO 8601, 선택).  
스테이션이 없으면 Delphi 모의 서버는 `station`을 빈 객체 `{}`로 돌려보냅니다.

**센서 알람 규칙:** 목록 GET은 **구현되어 있지 않음**. 생성·수정·삭제만 해당합니다.

| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/v1/sensor-alarm-rules` | 규칙 생성 |
| `PATCH` | `/v1/sensor-alarm-rules/{id}` | 규칙 수정 |
| `DELETE` | `/v1/sensor-alarm-rules/{id}` | 규칙 삭제 |

### Devices (구동 명령)

| Method | Path |
|--------|------|
| `GET` | `/v1/devices/status` |
| `POST` | `/v1/greenhouses/{greenhouseId}/water/start` |
| `POST` | `/v1/greenhouses/{greenhouseId}/water/stop` |
| `POST` | `/v1/greenhouses/{greenhouseId}/skylight/open` |
| `POST` | `/v1/greenhouses/{greenhouseId}/skylight/close` |
| `POST` | `/v1/greenhouses/{greenhouseId}/side-window/open` |
| `POST` | `/v1/greenhouses/{greenhouseId}/side-window/close` |
| `POST` | `/v1/greenhouses/{greenhouseId}/circulation-fan/start` |
| `POST` | `/v1/greenhouses/{greenhouseId}/circulation-fan/stop` |
| `POST` | `/v1/greenhouses/{greenhouseId}/heater/start` |
| `POST` | `/v1/greenhouses/{greenhouseId}/heater/stop` |
| `POST` | `/v1/greenhouses/{greenhouseId}/sprayer/start` |
| `POST` | `/v1/greenhouses/{greenhouseId}/sprayer/stop` |

> ⚠️ **고위험:** 관수·양액·히터·분무 등은 현장 안전 규칙에 따라 서버에서 거부할 수 있습니다. POST 본문은 현재 빈 객체 `{}` 로 처리됩니다.

### Nutrient solution

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/v1/nutrient/status` | 양액 시스템 상태 |
| `GET` | `/v1/nutrient/recipes` | 레시피 목록 |
| `POST` | `/v1/nutrient/recipe/select` | 레시피 선택 |
| `POST` | `/v1/nutrient/supply/start` | 공급 시작 |
| `POST` | `/v1/nutrient/supply/stop` | 공급 중지 |
| `GET` | `/v1/nutrient/history` | 이력 |

**POST 본문 예**

```json
{
  "recipeId": "rec-a"
}
```

```json
{
  "targetGreenhouseIds": ["gh-01", "gh-02"]
}
```

### Alarms

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/v1/alarms` | 발생 알람 목록 |
| `POST` | `/v1/alarms/{id}/acknowledge` | 확인 처리 |
| `GET` | `/v1/alarm-rules` | 알람 규칙 목록 |
| `POST` | `/v1/alarm-rules` | 규칙 생성 |
| `PATCH` | `/v1/alarm-rules/{id}` | 규칙 수정 |
| `DELETE` | `/v1/alarm-rules/{id}` | 규칙 삭제 |

### Work · 영농일지 · AI 초안

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/v1/work/instructions` | 작업 지시 |
| `GET` | `/v1/farm-diary` | 영농일지 목록 |
| `POST` | `/v1/farm-diary` | 일지 작성 |
| `PATCH` | `/v1/farm-diary/{id}` | 일지 수정 |
| `DELETE` | `/v1/farm-diary/{id}` | 일지 삭제 |
| `GET` | `/v1/ai/operation-report` | AI 운영 리포트 |
| `GET` | `/v1/control-orders/drafts` | 제어 초안 목록 |
| `POST` | `/v1/control-orders/drafts/{id}/approve` | 승인 |
| `POST` | `/v1/control-orders/drafts/{id}/hold` | 보류 |
| `POST` | `/v1/control-orders/drafts/{id}/reject` | 거부 |

> AI 초안 승인은 **메모리 상의 상태 필드만 변경**합니다. PLC 직접 실행은 본 모의 서버 범위에 포함되지 않습니다.

### Cameras

| Method | Path |
|--------|------|
| `GET` | `/v1/cameras` |
| `GET` | `/v1/cameras/{id}` |
| `POST` | `/v1/cameras/{id}/reboot` |
| `POST` | `/v1/cameras/{id}/power/on` |
| `POST` | `/v1/cameras/{id}/power/off` |

### Settings (부분 REST)

농장명·PLC 주소 등 **일반 설정 전용 `/v1/settings`는 없습니다.**  
다만 **온실 표시 이름·작목**은 **`PATCH /v1/greenhouses/{id}`** 로 갱신하며, Delphi 모의 서버는 `TFarmMockState`에 보관합니다.  
연결 확인은 **`GET /v1/system/status`** 및 클라이언트 환경 변수(`NEXT_PUBLIC_FARM_API_BASE_URL`)로 처리합니다.

---

## 4. 응답 스키마 예시 (메모리 목업)

실제 필드는 `lib/api/types.ts` 및 Delphi에서 생성하는 JSON과 동일 계열입니다.

### 4.1 `GET /v1/farm/status`

```json
{
  "farmId": "farm-1",
  "name": "Jeju 스마트팜 (모의)",
  "updatedAt": "2026-05-05T12:00:00.000Z",
  "overallHealth": "normal",
  "activeGreenhouseCount": 7,
  "greenhouses": [
    { "id": "gh-01", "name": "제1동", "cropName": "쪽파" }
  ]
}
```

`greenhouses`는 옵션 배열이며 요소는 `id`, `name`, `cropName`만 포함합니다.

### 4.2 `GET /v1/system/status`

```json
{
  "farmPcOnline": true,
  "apiVersion": "farm-mock-1.0",
  "plcBridgeStatus": "connected",
  "notice": "Delphi REST mock — PLC 미연동"
}
```

### 4.3 `GET /v1/greenhouses` (배열)

```json
[
  {
    "id": "gh-01",
    "name": "제1동",
    "cropName": "쪽파",
    "crop": "쪽파",
    "health": "normal",
    "mode": "AUTO"
  }
]
```

### 4.4 `GET /v1/devices/status`

```json
{
  "updatedAt": "2026-05-05T12:00:00.000Z",
  "greenhouses": [
    {
      "greenhouseId": "gh-01",
      "mode": "AUTO",
      "irrigationOn": false,
      "nutrientSupplyActive": false,
      "skylightOpenPct": 35,
      "sideWindowOpenPct": 20,
      "circulationFanOn": false,
      "heaterOn": false,
      "sprayerOn": false
    }
  ]
}
```

### 4.5 `GET /v1/climate/sensors`

```json
{
  "station": {
    "id": "met-field-1",
    "name": "부지 기상탑 MET-1",
    "location": "온실 단지 북측",
    "tempC": 18.4,
    "humidityPct": 72,
    "dewpointC": 13.1,
    "batteryPct": 88,
    "windMs": 2.3,
    "windDirLabel": "북동",
    "solarRadiationWm2": 420,
    "rainfallMm": 0.0,
    "measuredAt": "2026-05-05T12:00:00.000Z"
  }
}
```

### 4.6 구동·양액 등 명령 접수 (`CommandAcceptedDto`)

```json
{
  "requestId": "GUID문자열",
  "accepted": true,
  "message": "모드 변경(모의)"
}
```

---

## 5. 프런트엔드 매핑

동일 경로를 호출하는 모듈:

| 디렉터리 | 파일 |
|----------|------|
| `lib/api/` | `farm-api.ts`, `greenhouse-api.ts`(온실 상세·`PATCH` 프로필), `sensor-api.ts`, `climate-api.ts`, `device-api.ts`, `nutrient-api.ts`, `alarm-api.ts`, `work-api.ts`, `camera-api.ts`, `api-client.ts` |

---

## 6. 변경 이력

| 버전 | 내용 |
|------|------|
| 1.1 | Delphi 모의 서버·메모리 상태만 반영. 미구현·추측 API 제거. |
| 1.0 | 초안 |
