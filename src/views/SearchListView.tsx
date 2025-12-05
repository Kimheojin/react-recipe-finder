import { useEffect, useState } from "react";
import { container } from "tsyringe";
import SearchHeader from "../components/header/SearchHeader";
import SearchResultList from "../components/SearchResultList";
import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";
import ScrollToTopButton from "../components/ScrollToTopButton";
import IntegratedSearchRepository from "../repository/integrated/IntegratedSearchRepository";
import { useSearchStore } from "../stores/searchStore";

export default function SearchListView() {
  const INTEGRATEDSEARCH_REPO = container.resolve(IntegratedSearchRepository);
  const searchValue = useSearchStore((state) => state.searchValue);
  const settings = useSearchStore((state) => state.settings);
  const [searchResults, setSearchResults] =
    useState<ListSearchRecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [searchValue, settings.searchType]);

  useEffect(() => {
    if (!searchValue || !settings.searchType) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: ListSearchRecipeResponse;

        if (settings.searchType === "recipename") {
          result = await INTEGRATEDSEARCH_REPO.integratedRecipeName(
            page,
            pageSize,
            searchValue
          );
        } else if (settings.searchType === "ingredient") {
          result = await INTEGRATEDSEARCH_REPO.integratedIngredient(
            page,
            pageSize,
            searchValue
          );
        } else if (settings.searchType === "cookingorderlist") {
          result = await INTEGRATEDSEARCH_REPO.integratedCookingOrderList(
            page,
            pageSize,
            searchValue
          );
        } else {
          return;
        }

        setSearchResults(result);
      } catch (err) {
        console.error("검색 에러:", err);
        setError("검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [INTEGRATEDSEARCH_REPO, page, searchValue, settings.searchType]);

  return (
    <div className="space-y-8">
      <SearchHeader />
      {searchValue ? (
        <SearchResultList
          searchValue={searchValue}
          searchResults={searchResults}
          loading={loading}
          error={error}
          currentPage={page}
          onPageChange={setPage}
        />
      ) : (
        <div className="surface-card p-8 text-center text-[#5d636f] shadow-sm">
          검색어를 입력하면 맞춤 레시피를 추천해 드릴게요.
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
}
