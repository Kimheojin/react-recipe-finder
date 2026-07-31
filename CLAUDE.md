# CLAUDE.md

## 프로젝트 개요

React 19 + TypeScript + Vite 기반 레시피 검색/조회 웹앱. Tailwind CSS 사용.

## 라우팅

- React Router v7, classic `<Routes>/<Route>` 방식 (파일 기반 라우팅 아님)
- 정의 위치: `src/router/index.tsx`
- 주요 경로:
  - `/` → `HomeView` (검색창만 있는 홈 화면)
  - `/search-results` → `SearchListView`
  - `/recipes` → `RecipeListView` ("전체 레시피 보기")
  - `/guest` → `GuestView`
- `SearchHeader` 컴포넌트가 `HomeView`/`RecipeListView` 등 여러 화면에서 공유됨

## 데이터 계층

- 실제 백엔드 API 사용 (mock/로컬 JSON 아님), axios 기반
- `src/http/AxiosHttpClient.ts`: axios 인스턴스, `baseURL`은 `VITE_API_URL` 환경변수, `withCredentials: true`
- `src/http/HttpRepository.ts`: get/post 얇은 래퍼
- `src/repository/` 아래에 도메인별 Repository 클래스 (예: `basicSearch/BasicSearchRepository.ts`)
- DI: `tsyringe` 사용. Repository는 `@singleton()`으로 등록, 컴포넌트에서 `container.resolve(XxxRepository)`로 가져와 사용
- 데이터 fetching 패턴: 공통 fetch 훅이나 캐싱 레이어 없이, 각 View 컴포넌트가 자체 `useEffect` + `useState`로 직접 호출 (React Query/SWR 미사용, 공유 캐시 없음)

## 상태관리

- 전역 UI 상태: Zustand (`src/stores/`, 예: `searchStore.ts`의 `useSearchStore` — 검색어/검색 설정)
- 서버에서 가져온 데이터(레시피 목록 등)는 전역 스토어에 두지 않고 각 View의 로컬 state로만 관리됨

## 기타 참고

- `docs/` 폴더: 아키텍처 다이어그램 등 일반 참고 자료 (`project-architecture.png`)
- `GEMINI.md`: Gemini(학습용 챗봇) 전용 사용 규칙 문서. Claude 작업과는 무관하므로 이 파일의 컨벤션(문서 저장 위치/번호 규칙 등)을 Claude 작업에 적용하지 않음
