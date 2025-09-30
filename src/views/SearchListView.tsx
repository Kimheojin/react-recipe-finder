import SearchHeader from "../components/SearchHeader";
import SearchResultList from "../components/SearchResultList";
import { useSearchStore } from "../stores/searchStore";
import { container } from "tsyringe";
import IntegratedSearchRepository from "../repository/integrated/IntegratedSearchRepository";
import { useEffect, useState } from "react";
import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";

export default function SearchListView() {
    const INTEGRATEDSEARCH_REPO = container.resolve(IntegratedSearchRepository);
    const searchValue = useSearchStore((state) => state.searchValue);
    const settings = useSearchStore((state) => state.settings);
    const [searchResults, setSearchResults] =
        useState<ListSearchRecipeResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!searchValue || !settings.searchType) return;

        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                let result: ListSearchRecipeResponse;

                if (settings.searchType === "recipename") {
                    result = await INTEGRATEDSEARCH_REPO.integratedRecipeName(
                        searchValue
                    );
                } else if (settings.searchType === "ingredient") {
                    result = await INTEGRATEDSEARCH_REPO.integratedIngredient(
                        searchValue
                    );
                } else if (settings.searchType === "cookingorderlist") {
                    result =
                        await INTEGRATEDSEARCH_REPO.integratedCookingOrderList(
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
    }, [searchValue, settings.searchType]);

    return (
        <>
            <SearchHeader />

            {/* 검색 결과 영역 */}
            <SearchResultList
                searchValue={searchValue}
                searchResults={searchResults}
                loading={loading}
                error={error}
            />
        </>
    );
}
