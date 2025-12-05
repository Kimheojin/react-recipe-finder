import { useEffect, useState } from "react";
import { container } from "tsyringe";
import SearchHeader from "../components/header/SearchHeader";
import SearchResultList from "../components/SearchResultList";
import ScrollToTopButton from "../components/ScrollToTopButton";
import type ListRecipeResponse from "../entity/basicSearch/response/ListRecipeResponse";
import type ErrorResponse from "../entity/interface/ErrorResponse";
import BasicSearchRepository from "../repository/basicSearch/BasicSearchRepository";
import HttpError from "../http/HttpError";

export default function RecipeListView() {
  const BASIC_SEARCH_REPO = container.resolve(BasicSearchRepository);
  const [recipeData, setRecipeData] = useState<ListRecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageOffset, setPageOffset] = useState(0);
  const [lastObjectId, setLastObjectId] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchRecipeCount = async () => {
      try {
        const countData = await BASIC_SEARCH_REPO.getRecipeCount();
        setTotalCount(countData.recipeCount);
      } catch (err) {
        console.error("레시피 개수 조회 에러:", err);
      }
    };

    fetchRecipeCount();
  }, [BASIC_SEARCH_REPO]);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await BASIC_SEARCH_REPO.getPagingRecipe(
          pageOffset,
          pageSize,
          lastObjectId
        );
        setRecipeData(result);

        if (result.recipes && result.recipes.length > 0) {
          const lastRecipe = result.recipes[result.recipes.length - 1];
          setLastObjectId(lastRecipe.objectId);
        }
      } catch (err) {
        const httpError = new HttpError(err as ErrorResponse);
        setError(httpError.getMessage());
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [BASIC_SEARCH_REPO, currentPage, pageOffset, pageSize]);

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
    setPageOffset(-1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
    setPageOffset(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="space-y-8">
      <SearchHeader />

      <SearchResultList
        searchValue=""
        searchResults={
          recipeData
            ? { totalCount, totalPages, currentPage, pageSize, recipes: recipeData.recipes }
            : null
        }
        loading={loading}
        error={error}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <div className="surface-card flex flex-wrap items-center justify-between gap-4 px-6 py-4 shadow-sm">
        <span className="text-sm text-[#5d636f]">
          페이지 {currentPage} / {totalPages}
        </span>
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="rounded-full border border-[#d7dbe2] px-4 py-2 text-sm font-semibold text-[#1f2329] transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#2f5bda] hover:text-[#2f5bda]"
          >
            이전
          </button>
          <button
            onClick={handleNext}
            disabled={!recipeData || recipeData.recipes.length === 0}
            className="rounded-full border border-[#2f5bda] bg-[#2f5bda] px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#2549a6]"
          >
            다음
          </button>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
