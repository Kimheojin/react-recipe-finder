# 레시피 전체보기 프리페치 구현 정리

`recipe-list-prefetch-review.md`에서 검토한 "Zustand 캐시 스토어 신설" 안을 구현한 결과 정리.

## 구현한 것

- **`src/stores/recipeListCacheStore.ts` (신규)**
  - 기존 `searchStore.ts`와 동일한 Zustand 패턴
  - State: `page1Data`, `totalCount`, `lastObjectId`, `fetchedAt`, `isFetching`
  - `isCacheFresh()`: `fetchedAt`이 있고 60초(`TTL_MS`) 이내면 `true`
  - `prefetchFirstPage()`:
    - 이미 `isFetching` 중이거나 캐시가 신선하면 즉시 반환 (중복 호출 방지)
    - `container.resolve(BasicSearchRepository)`로 리포지토리를 얻어 `getPagingRecipe(0, 10, "")`와 `getRecipeCount()`를 `Promise.all`로 병렬 호출
    - 실패하면 `console.error`만 하고 조용히 무시 (백그라운드 프리페치라 홈 화면 UX를 막지 않음 → 캐시가 비면 `RecipeListView`가 알아서 정상 fetch로 폴백)

- **`src/views/HomeView.tsx`**
  - 마운트 시 `useEffect(() => { useRecipeListCacheStore.getState().prefetchFirstPage(); }, [])` 1회 호출
  - `getState()`로 직접 접근했기 때문에 컴포넌트가 이 값을 구독하지 않음 → 리렌더링 유발 없음

- **`src/views/RecipeListView.tsx`**
  - 렌더링 시점에 `useRecipeListCacheStore.getState().isCacheFresh()`를 한 번 읽어 `isCacheHit` 계산
  - `isCacheHit`이 `true`면 `recipeData`/`lastObjectId`/`totalCount`의 `useState` 초기값을 캐시 값으로 채워서 첫 렌더부터 데이터가 보이도록 함
  - 두 개의 초기 `useEffect`(카운트 조회, 페이징 조회)는 각각 `skipInitialCountFetchRef` / `skipInitialPagingFetchRef`로 캐시 히트 여부를 확인해 최초 fetch를 건너뜀
  - "다음"/"이전" 클릭 이후에는 캐시를 다시 참조하지 않고 기존 로직대로 정상 fetch

## 참고할 개념

- **Zustand `getState()` vs 훅 구독**
  - 컴포넌트 리렌더링과 무관하게 "지금 이 순간 값"만 읽고 싶으면 `useStore()` 훅 대신 `useStore.getState()`를 씀
  - `HomeView`의 프리페치 트리거, `RecipeListView`의 마운트 시 캐시 스냅샷 읽기 모두 이 패턴 — 스토어 값이 바뀔 때마다 컴포넌트가 다시 그려질 필요가 없는 "한 번만 읽으면 되는" 상황에 적합

- **`useState`의 초기값(initial value) 인자는 첫 렌더에만 반영됨**
  - `useState(isCacheHit ? cacheAtMount.page1Data : null)`처럼 렌더 시점에 계산한 값을 넘겨도, React는 컴포넌트가 처음 마운트될 때만 이 값을 사용하고 이후 리렌더링에서는 무시함
  - 그래서 `isCacheHit`을 매 렌더마다 다시 계산해도(순수 함수 호출이라 비용도 낮음) 상태가 캐시 값으로 계속 덮어써질 걱정은 없음

- **React StrictMode의 effect 이중 실행 함정 (구현 중 실제로 겪은 버그)**
  - 이 프로젝트는 `main.tsx`에서 `<StrictMode>`를 쓰고 있어서, 개발 모드에서는 컴포넌트가 마운트될 때 각 `useEffect`의 setup 함수가 "실행 → cleanup → 재실행" 순서로 **두 번** 호출됨
  - 처음엔 "캐시가 있으면 skip 플래그를 한 번 소비하고 `false`로 뒤집는" 방식(`ref.current = false`)으로 구현했는데, StrictMode가 같은 effect를 두 번째로 실행할 때는 이미 플래그가 `false`라 실제 fetch가 다시 일어나 캐시된 데이터를 조용히 덮어써버리는 문제가 있었음
  - **해결**: ref를 mutate하지 않고, `pageOffset === 0`이라는 "최초 마운트에서만 성립하는 조건"을 함께 검사하도록 바꿈. `pageOffset`은 마운트 시 `0`이고 "다음"/"이전" 클릭 후에는 항상 `+1`/`-1`이라 최초 진입 이후로는 절대 `0`으로 돌아오지 않음 → mutation 없이도 "최초 진입일 때만 skip"이 자연스럽게 성립하고, StrictMode가 같은 effect를 몇 번 실행하든 결과가 달라지지 않음
  - 일반화하면: StrictMode 대응이 필요한 "한 번만 실행하고 싶은 effect" 로직은 **ref를 직접 뒤집는 대신, 이미 상태(state)에 존재하는 "최초 상태임을 판별할 수 있는 값"으로 조건을 세우는 편이 안전함**

- **커서 기반 페이징 (`objectId`)**
  - `BasicSearchRepository.getPagingRecipe(page, pageSize, objectId)`의 `page` 인자는 절대 페이지 번호가 아니라 **커서 이동 방향 오프셋**임 (마운트 시 `0`, "다음" `+1`, "이전" `-1`)
  - `objectId`는 직전에 받은 목록의 마지막 `objectId`를 커서로 사용
  - 그래서 프리페치의 첫 페이지 요청도 `getPagingRecipe(0, 10, "")`로 맞춰야 함 (검토 문서 초안에는 `getPagingRecipe(1, 10, "")`로 잘못 적혀 있었는데, 실제 코드 기준으로 구현하면서 바로잡음)

## 검증 방법

- 실제 백엔드(`VITE_API_URL`)가 로컬 환경에 없어서, Playwright 헤드리스 브라우저 + API 라우트 모킹으로 대체 검증
  1. 홈 진입 → `/seo/basic/recipes`, `/seo/basic/recipescount` 2건이 백그라운드로 호출되는지 확인
  2. "전체 레시피 보기" 클릭 → `/recipes` 진입 시 추가 네트워크 요청 없이 캐시된 데이터가 즉시 렌더링되는지 확인 (StrictMode 버그 수정 전에는 여기서 요청이 2건 더 나가는 게 재현됐음)
  3. 캐시 없이 `/recipes` 직접 진입 시 정상적으로 fetch되는지 확인
  4. "다음"/"이전" 클릭 시 `page`/`objectId` 파라미터가 기존과 동일하게 동작하는지 확인
- `tsc --noEmit`, `eslint` 통과 확인 (기존에도 있던 `RecipeListView`의 `lastObjectId` 의존성 경고 1건은 이번 변경과 무관)
