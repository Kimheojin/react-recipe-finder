# 레시피 전체보기 프리페치 검토

## 배경

- 홈 화면(`/`, `HomeView`)은 `SearchHeader`만 렌더링하고 API 호출이 전혀 없음
- "전체 레시피 보기" 버튼(`ViewAllbutton`)을 눌러 `/recipes`(`RecipeListView`)로 이동해야 그때 API 2건이 호출됨
  - `getRecipeCount()` → `GET /seo/basic/recipescount`
  - `getPagingRecipe(page, pageSize, objectId)` → `GET /seo/basic/recipes`
- 홈 화면에 머무는 동안 네트워크는 유휴 상태임. 이 시간을 이용해 첫 페이지 데이터를 미리 받아두면 `/recipes` 진입 시 로딩 없이 즉시 렌더링 가능함

## 현재 구조 파악 결과

- 라우팅: React Router v7, classic `<Routes>/<Route>` (`src/router/index.tsx`). React Router의 loader/prefetch 기능은 사용하지 않음
- 데이터 계층: 실제 백엔드 API(axios). `BasicSearchRepository`(`src/repository/basicSearch/BasicSearchRepository.ts`)가 tsyringe `@singleton()`으로 등록돼 있고 `container.resolve(BasicSearchRepository)`로 어디서든 같은 인스턴스를 가져올 수 있음
- 문제점: 리포지토리는 싱글톤이지만, 응답 데이터 자체는 `RecipeListView`의 로컬 `useState`에만 저장됨. 공유 캐시가 없어서 API를 미리 호출해도 `RecipeListView`가 그 결과를 재사용할 방법이 없음
- 상태관리: 전역 상태는 Zustand(`src/stores/searchStore.ts`)만 존재, 데이터 fetching 캐싱 라이브러리(React Query, SWR 등)는 없음

## 검토한 방법

1. **Zustand 캐시 스토어 신설 (채택)**
   - `src/stores/recipeListCacheStore.ts` 신규 작성, 기존 `useSearchStore` 패턴을 그대로 따름
   - state: `page1Data`, `totalCount`, `lastObjectId`, `fetchedAt`, `isFetching`
   - `prefetchFirstPage()` 액션에서 `getPagingRecipe(1, 10, "")`와 `getRecipeCount()`를 병렬 호출해 스토어에 저장
   - `HomeView` 마운트 시 `prefetchFirstPage()` 1회 호출(백그라운드, 언마운트돼도 요청은 전역 상태로 이어짐)
   - `RecipeListView`는 마운트 시(첫 페이지 진입 한정) 캐시가 TTL 이내(30~60초)면 API 호출을 건너뛰고 캐시된 값으로 즉시 렌더링, 아니면 기존 로직대로 fetch
   - 기존 스택(Zustand)만 재사용하므로 추가 라이브러리 도입 없이 구현 가능

2. **React Query / SWR 도입 (기각)**
   - 요청 캐싱/중복제거가 자동화되지만, 현재 프로젝트에 없는 라이브러리를 새로 들여오는 비용이 있고 기존 fetch 패턴(로컬 useEffect+useState)을 전면 교체해야 함

3. **"전체 레시피 보기" 버튼 hover/focus 시 프리페치 (기각)**
   - 트리거 시점이 클릭 직전으로 늦어서 캐시가 준비되지 않을 가능성이 있고, 모바일 터치 환경에서는 hover 이벤트 자체가 없음

4. **React Router v7 data loader 방식 (기각)**
   - 현재 classic `<Routes>/<Route>` 구조를 data router(`createBrowserRouter` + `loader`)로 바꿔야 해서 리팩토링 범위가 이번 목적 대비 큼

## TTL 정책

- 짧은 TTL(30~60초)로 정함
- 홈 화면 진입 직후 클릭하면 캐시 히트로 즉시 로딩, 오래 머물다 클릭하면 캐시 만료로 다시 fetch되어 최신 데이터 보장

## 다음 구현 시 변경할 파일

- `src/stores/recipeListCacheStore.ts` (신규) — 캐시 스토어와 `prefetchFirstPage()` 액션
- `src/views/HomeView.tsx` — 마운트 시 `prefetchFirstPage()` 호출 추가
- `src/views/RecipeListView.tsx` — 마운트 시 캐시 우선 조회 로직 추가(캐시 미스일 때만 기존 fetch 실행)

## 검증 방법(구현 시)

1. `npm run dev` 실행 후 홈 화면 진입 시 Network 탭에서 `/seo/basic/recipes`, `/seo/basic/recipescount`가 즉시 호출되는지 확인
2. 곧바로 "전체 레시피 보기" 클릭 시 로딩 스피너 없이 즉시 렌더링되는지 확인(캐시 히트)
3. 45초 이상 대기 후 진입 시 캐시 만료로 정상적으로 재요청되는지 확인
4. 페이지 이동(다음/이전)이 기존과 동일하게 동작하는지 회귀 확인
