import SearchResultList from "../components/SearchResultList";
import { container } from "tsyringe";
import BasicSearchRepository from "../repository/basicSearch/BasicSearchRepository";
import { useEffect, useState } from "react";
import type ListRecipeResponse from "../entity/basicSearch/response/ListRecipeResponse";
import type ErrorResponse from "../entity/interface/ErrorResponse";

import SearchHeader from "../components/header/SearchHeader";
import HttpError from "../http/HttpError";

export default function RecipeListView() {
    const BASIC_SEARCH_REPO = container.resolve(BasicSearchRepository);
    const [recipeData, setRecipeData] = useState<ListRecipeResponse | null>(
        null
    );
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
    }, []);

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

                // 마지막 레시피의 objectId 저장
                if (result.recipes && result.recipes.length > 0) {
                    const lastRecipe =
                        result.recipes[result.recipes.length - 1];
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
    }, [currentPage]);

    return (
        <>
            <SearchHeader />

            <h1>전체 레시피 목록</h1>

            <SearchResultList
                searchValue=""
                searchResults={
                    recipeData
                        ? {
                              totalCount: totalCount,
                              totalPages: 1,
                              currentPage: currentPage,
                              pageSize: pageSize,
                              recipes: recipeData.recipes,
                          }
                        : null
                }
                loading={loading}
                error={error}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <div className="m-5 text-center">
                <button
                    className="py-2 px-4 mr-[10px]"
                    onClick={() => {
                        setCurrentPage((p) => p - 1);
                        setPageOffset(-1);
                    }}
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                <span>페이지: {currentPage}</span>
                <button
                    className="py-2 px-4 ml-[10px]"
                    onClick={() => {
                        setCurrentPage((p) => p + 1);
                        setPageOffset(1);
                    }}
                    disabled={!recipeData || recipeData.recipes.length === 0}
                >
                    다음
                </button>
            </div>
        </>
    );
}
