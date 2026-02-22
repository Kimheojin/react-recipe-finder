import { useEffect, useState } from "react";
import { LuExternalLink, LuUtensils } from "react-icons/lu";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { container } from "tsyringe";
import type SingleRecipeResponse from "../entity/data/recipe/SingleRecipeResponse";
import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";
import GuestRepository from "../repository/guest/GuestRepository";

interface SearchResultListProps {
  searchValue: string;
  searchResults: ListSearchRecipeResponse | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onStatusChange?: () => void; // 상태 변경 시(좋아요 해제 등) 부모에게 알림
}

function RecipeCard({ 
  recipe, 
  onStatusChange 
}: { 
  recipe: SingleRecipeResponse;
  onStatusChange?: () => void;
}) {
  const GUEST_REPO = container.resolve(GuestRepository);
  const ingredients = recipe.ingredientList ?? [];
  const steps = recipe.cookingOrderList ?? [];
  const topIngredients = ingredients.slice(0, 5);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<
    "idle" | "copied" | "failed"
  >("idle");
  
  // 상태 관리
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // 초기 상태 가져오기
    const checkStatus = async () => {
      try {
        const status = await GUEST_REPO.getRecipeStatus(recipe.objectId);
        setIsLiked(status.liked);
        setIsBookmarked(status.bookmarked);
      } catch (err) {
        console.error("상태 확인 실패:", err);
      }
    };
    checkStatus();
  }, [recipe.objectId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await GUEST_REPO.toggleLike(recipe.objectId);
      setIsLiked(!isLiked);
      onStatusChange?.();
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
    }
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await GUEST_REPO.toggleBookmark(recipe.objectId);
      setIsBookmarked(!isBookmarked);
      onStatusChange?.();
    } catch (err) {
      console.error("북마크 토글 실패:", err);
    }
  };

  const displayedIngredients = showAllIngredients ? ingredients : topIngredients;
  const hasMoreIngredients = ingredients.length > topIngredients.length;

  useEffect(() => {
    if (copyFeedback === "idle") {
      return;
    }
    const timer = window.setTimeout(() => setCopyFeedback("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [copyFeedback]);

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const buildRecipeText = () => {
    const lines: string[] = [];
    lines.push(`레시피 이름: ${recipe.recipeName}`);
    if (recipe.siteIndex) {
      lines.push(`출처 구분: ${recipe.siteIndex}`);
    }
    if (recipe.sourceUrl) {
      lines.push(`원문 링크: ${recipe.sourceUrl}`);
    }
    if (ingredients.length > 0) {
      lines.push(`재료 (${ingredients.length}개): ${ingredients.join(", ")}`);
    }
    if (steps.length > 0) {
      lines.push("조리 순서:");
      steps.forEach((step) => {
        lines.push(`${step.step}. ${step.instruction}`);
      });
    }
    return lines.join("\n");
  };

  const handleCopySource = async () => {
    const recipeText = buildRecipeText();

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(recipeText);
      } else {
        fallbackCopy(recipeText);
      }
      setCopyFeedback("copied");
    } catch {
      try {
        fallbackCopy(recipeText);
        setCopyFeedback("copied");
      } catch {
        setCopyFeedback("failed");
      }
    }
  };

  const copyButtonLabel =
    copyFeedback === "copied"
      ? "복사됨!"
      : copyFeedback === "failed"
      ? "복사 실패"
      : "레시피 복사";

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
        <div className="flex flex-wrap items-center gap-2">
          {/* 좋아요 토글 */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isLiked
                ? "border-[#fde2e2] bg-[#fef2f2] text-[#ef4444]"
                : "border-[#d7dbe2] text-[#1f2329] hover:border-[#ef4444] hover:text-[#ef4444]"
            }`}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>

          {/* 북마크 토글 */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isBookmarked
                ? "border-[#fff3c7] bg-[#fffcf0] text-[#f59e0b]"
                : "border-[#d7dbe2] text-[#1f2329] hover:border-[#f59e0b] hover:text-[#f59e0b]"
            }`}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>

          <button
            type="button"
            onClick={handleCopySource}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
              copyFeedback === "failed"
                ? "border-red-300 text-red-600"
                : "border-[#d7dbe2] text-[#1f2329] hover:border-[#2f5bda] hover:text-[#2f5bda]"
            } ${
              copyFeedback === "copied" ? "bg-[#eef3ff] text-[#1f2329]" : ""
            }`}
            aria-live="polite"
          >
            {copyButtonLabel}
          </button>
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
      </div>

      {ingredients.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {displayedIngredients.map((ingredient) => (
            <span
              key={`${recipe.objectId}-${ingredient}`}
              className="pill bg-[#eef3ff] text-[#1f2329]"
            >
              {ingredient}
            </span>
          ))}
          {hasMoreIngredients && (
            <button
              type="button"
              onClick={() => setShowAllIngredients((prev) => !prev)}
              className="pill bg-[#f5f6f8] text-[#5d636f] transition hover:bg-[#eef1f6]"
            >
              {showAllIngredients
                ? "재료 접기"
                : `+${ingredients.length - topIngredients.length} 더 보기`}
            </button>
          )}
        </div>
      )}

      {steps.some((step) => step.instruction?.trim()) && (
        <div className="mt-6 rounded-2xl border border-[#eef0f4] bg-[#f9fafb] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2329]">
            <LuUtensils /> 조리 순서
          </div>
          <ol className="mt-3 space-y-3 text-sm text-[#4b505b]">
            {steps
              .filter((step) => step.instruction?.trim())
              .map((step) => (
                <li
                  key={`${recipe.objectId}-${step.step}`}
                  className="flex items-start gap-3"
                >
                  <span className="pill bg-[#2f5bda] text-white flex-shrink-0">
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
  onStatusChange,
}: SearchResultListProps) {
  const location = useLocation();
  const isRecipesPage = location.pathname === "/recipes";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
          <RecipeCard 
            key={recipe.objectId} 
            recipe={recipe} 
            onStatusChange={onStatusChange}
          />
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
