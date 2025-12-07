# TravelTune Front-End API 보고서

이 문서는 현재 `TravelTune` 프론트엔드가 어떤 구조와 API 연동 방식으로 동작하는지 공유용으로 정리한 자료다. Vue 3 + Vite 기반이며 인증·추천·지도 기능을 각각 독립된 모듈로 구성해둔 상태다.

## 프로젝트 구성 개요

```text
src/
├─ api/
│  ├─ axiosApi.js          # 공통 axios 인스턴스 및 토큰 인터셉터
│  └─ memberApi.js         # 로그인/회원가입 HTTP 래퍼
├─ components/
│  ├─ auth/                # 로그인·회원가입 폼
│  └─ music/
│     ├─ MapContainer.vue  # 카카오 지도 + 장소 카드 시트
│     └─ MusicPlayerContainer.vue # Spotify 추천 재생기
├─ pages/                  # 라우트 단위 페이지 (Auth, Music, TravelPlan 등)
├─ router/                 # src/router/index.js 라우팅 정의
└─ stores/
   ├─ userTokenStore.js    # API 접근 토큰 Pinia 스토어
   └─ spotify.js           # Spotify access token 스토어
```

- 상태 관리는 Pinia(`src/stores`)로 처리하며, API 호출부(`src/api`)는 UI와 분리되어 있다.
- 음악 추천 화면(`src/pages/MusicRecommendationPage.vue`)은 카카오 지도, 자체 백엔드, Spotify API 세 가지 외부 연동을 동시에 사용한다.

## 공통 HTTP 클라이언트와 환경 변수

| 항목 | 설명 | 관련 파일 |
| --- | --- | --- |
| `axiosApi` | `axios.create`를 통해 기본 `baseURL`, `timeout`, `Content-Type`을 설정하고, 요청 인터셉터에서 Pinia 토큰(`useTokenStore`)을 읽어 `Authorization: Bearer` 헤더를 삽입한다. | `src/api/axiosApi.js` |
| `VITE_API_BASE_URL` | REST 백엔드 기본 주소. 모든 `axiosApi` 요청이 이 값을 기준으로 상대 경로를 해석한다. | `.env` (미포함, `axiosApi.js`에서 사용) |
| `VITE_KAKAO_JAVASCRIPT_KEY` | 카카오 지도 SDK 스크립트 로딩 시 필요한 앱 키. | `src/components/music/MapContainer.vue` |

> **참고**: `axiosApi`에서 사용하는 토큰은 `useTokenStore`의 `userAccessToken` 값을 통해 설정된다. 토큰 발급 로직은 아직 구현되지 않았으므로, 백엔드 연동 시 `setUserAccessToken`을 호출하도록 후속 작업이 필요하다.

## 인증 API

`src/api/memberApi.js`는 백엔드 `member` 도메인 엔드포인트를 래핑한다. 현재 두 함수 모두 `axiosApi` 호출을 트리거하는 역할을 하며, UI 단에서는 `await`로 비동기 완료 여부를 제어한다.

| 기능 | HTTP | 경로 | 요청 Body | 사용 화면 |
| --- | --- | --- | --- | --- |
| 로그인 | `POST` | `/member/login` | `{ email, password }` | `src/pages/AuthPage.vue` (`mode: login`) |
| 회원가입 | `POST` | `/member/signup` | `{ email, password }` | `src/pages/AuthPage.vue` (`mode: signup`) |

- 요청 시 `withCredentials` 옵션은 로그인에만 붙어 있어, 세션/쿠키 기반 인증을 염두에 둔 구성이다.
- 성공 시 응답 처리 로직은 아직 비어 있어(토큰 저장, 리다이렉션 등) `AuthPage`에서 메시지를 띄우는 수준이다. 응답으로 전달되는 액세스 토큰을 `useTokenStore.setUserAccessToken`에 저장하고, 실패 시 서버 메시지를 사용자에게 노출하도록 확장하면 된다.

## Spotify OAuth & 추천 연동

음악 추천 화면은 Spotify OAuth → 백엔드 추천 API → Spotify Web Playback SDK 순으로 동작한다.

1. **OAuth 시작** (`src/pages/MusicRecommendationPage.vue`): 사용자가 `loginWithSpotify` 버튼을 누르면 `http://localhost:3001/login`으로 이동한다. 이 주소는 백엔드가 Spotify OAuth 인증 URL로 리디렉션 시키는 용도다.
2. **Callback 처리** (`src/pages/SpotifySuccess.vue`): Spotify에서 `access_token` 쿼리 파라미터를 붙여 `/spotify-success`로 되돌아오면 Pinia `useSpotifyStore`에 토큰을 저장하고 `/music`으로 다시 라우팅한다.
3. **추천 곡 로딩** (`src/components/music/MusicPlayerContainer.vue`):
   - `fetch('http://localhost:3001/api/recommend')` 호출로 서버 측 추천 결과(Spotify API 프록시)를 가져온다. 응답 형태는 `data.tracks.items` 기준으로 가공하고, 각 곡에 `spotifyUri`, `previewUrl`, `artist`, `albumImage` 등을 매핑한다.
4. **Web Playback 제어** (`MusicPlayerContainer.vue`):
   - SDK 초기화(`initSpotifyPlayer`) 후 `https://api.spotify.com/v1/me/player/play` 및 `.../pause`와 같은 Spotify REST 엔드포인트를 직접 호출한다. 헤더에는 `Authorization: Bearer <spotify access token>`이 필요하며, `device_id`는 SDK에서 제공하는 값을 사용한다.
   - 재생/일시정지/다음 곡/이전 곡 컨트롤은 모두 SDK 디바이스에 명령을 내려 수행한다.

> **백엔드 연동 포인트**  
> - `http://localhost:3001/login`과 `http://localhost:3001/api/recommend`는 현재 개발 단계 하드코딩 값이다. 실제 배포 시 `.env`로 분리하거나 프록시 설정을 통해 환경별 주소를 관리해야 한다.  
> - 추천 API 응답은 Spotify의 `Get Recommendations` 결과 포맷과 유사하게 `tracks.items[*]` 배열을 기대하고 있으므로, 백엔드에서 해당 구조로 변환해야 한다.

## Kakao 지도 연동

`src/components/music/MapContainer.vue`는 카카오 지도 SDK를 동적으로 로딩한 뒤, 보유한 여행지 데이터(`attractions`)를 기반으로 마커를 생성한다.

- SDK 스크립트는 `//dapi.kakao.com/v2/maps/sdk.js?appkey=<VITE_KAKAO_JAVASCRIPT_KEY>&autoload=false`로 삽입하며, 로딩 완료 후 `kakao.maps.load` 콜백에서 `initMap`을 실행한다.
- 마커 클릭 시 Vue `selectedPlace` 상태를 업데이트하여 `AlbumScene` 시트를 토글한다. 추후 백엔드에서 받아온 장소 데이터에 맞춰 `attractions` 배열을 대체하면 된다.

## 향후 확장 메모

1. `memberApi.js`가 `axiosApi` 호출 결과를 반환하도록 보강하면, `AuthPage`의 `await`가 실제 네트워크 에러를 감지할 수 있다.
2. Spotify OAuth 엔드포인트(`localhost:3001`)와 추천 API 주소를 환경 변수화하고, 프런트에서 `import.meta.env`를 통해 주입받을 수 있게 정리한다.
3. 추천 API와 카카오 지도 데이터를 통합하여 특정 장소에 맞는 음악을 동시에 보여주려면, 지도 클릭 이벤트에서 곡 목록을 필터링하거나 새로운 API 호출을 트리거하도록 UI 흐름을 정의하는 것이 좋다.

필요 시 이 문서를 기반으로 백엔드 스펙 문서나 API 명세서(Swagger 등)와 연동하여 보다 상세한 보고 자료를 만들 수 있다.
