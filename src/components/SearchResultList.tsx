import { LuExternalLink, LuUtensils } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import type SingleRecipeResponse from "../entity/data/recipe/SingleRecipeResponse";
import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";

interface SearchResultListProps {
  searchValue: string;
  searchResults: ListSearchRecipeResponse | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function RecipeCard({ recipe }: { recipe: SingleRecipeResponse }) {
  const ingredients = recipe.ingredientList ?? [];
  const steps = recipe.cookingOrderList ?? [];
  const topIngredients = ingredients.slice(0, 5);

  return (
    <article className="surface-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#7a8393]">
            #{recipe.siteIndex ?? "origin"}
          </p>
          <h3 className="mt-1 text-xl font-bold text-[#121417]">
            {recipe.recipeName}
          </h3>
        </div>
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#d7dbe2] px-4 py-2 text-sm font-semibold text-[#1f2329] transition hover:border-[#2f5bda] hover:text-[#2f5bda]"
        >
          원문 보기
          <LuExternalLink />
        </a>
      </div>

      {topIngredients.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topIngredients.map((ingredient) => (
            <span
              key={`${recipe.objectId}-${ingredient}`}
              className="pill bg-[#eef3ff] text-[#1f2329]"
            >
              {ingredient}
            </span>
          ))}
          {ingredients.length > topIngredients.length && (
            <span className="pill bg-[#f5f6f8] text-[#5d636f]">
              +{ingredients.length - topIngredients.length}
            </span>
          )}
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[#eef0f4] bg-[#f9fafb] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2329]">
            <LuUtensils /> 조리 순서
          </div>
          <ol className="mt-3 space-y-3 text-sm text-[#4b505b]">
            {steps.map((step) => (
              <li
                key={`${recipe.objectId}-${step.step}`}
                className="flex gap-3"
              >
                <span className="pill bg-[#2f5bda] text-white">
                  {step.step}
                </span>
                <p className="leading-6">{step.instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

export default function SearchResultList({
  searchValue,
  searchResults,
  loading,
  error,
  currentPage,
  onPageChange,
}: SearchResultListProps) {
  const location = useLocation();
  const isRecipesPage = location.pathname === "/recipes";

  if (loading) {
    return (
      <div className="surface-card p-8 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded-full bg-[#e4e6eb]" />
        <div className="mt-4 space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-4 animate-pulse rounded-full bg-[#edf0f4]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface-card border-red-200 bg-red-50/70 p-6 text-red-800 shadow-sm">
        {error}
      </div>
    );
  }

  if (
    !searchResults ||
    !searchResults.recipes ||
    searchResults.recipes.length === 0
  ) {
    return (
      <div className="surface-card p-6 text-center text-[#5d636f] shadow-sm">
        검색 결과가 없습니다. 다른 재료나 키워드로 시도해 보세요.
      </div>
    );
  }

  const isSearchMode = Boolean(searchValue);
  const headerTitle = isSearchMode
    ? `"${searchValue}" 검색 결과`
    : "전체 레시피 모아보기";
  const headerSubtitle = isSearchMode
    ? `${searchResults.totalPages} 페이지 중 ${
        searchResults.currentPage
      } 페이지`
    : `${searchResults.totalCount.toLocaleString()}개의 레시피가 준비되어 있어요.`;

  return (
    <section className="space-y-5">
      <header className="surface-card flex flex-col gap-2 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7a8393]">
          총 {searchResults.totalCount.toLocaleString()}개 레시피
        </p>
        <h2 className="text-2xl font-bold text-[#121417]">{headerTitle}</h2>
        <p className="text-sm text-[#5d636f]">{headerSubtitle}</p>
      </header>

      <div className="space-y-5">
        {searchResults.recipes.map((recipe) => (
          <RecipeCard key={recipe.objectId} recipe={recipe} />
        ))}
      </div>

      {!isRecipesPage && (
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 px-6 py-3 text-sm shadow-sm">
          <span className="text-[#5d636f]">
            {currentPage} / {searchResults.totalPages}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full border border-[#d7dbe2] px-4 py-2 font-semibold text-[#1f2329] transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#2f5bda] hover:text-[#2f5bda]"
            >
              이전
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === searchResults.totalPages}
              className="rounded-full border border-[#2f5bda] bg-[#2f5bda] px-4 py-2 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#2549a6]"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
