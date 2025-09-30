import SearchResultList from "../components/SearchResultList";
import { container } from "tsyringe";
import BasicSearchRepository from "../repository/basicSearch/BasicSearchRepository";
import { useEffect, useState } from "react";
import type ListRecipeResponse from "../entity/basicSearch/response/ListRecipeResponse";

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
    const pageSize = 10;

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
                console.error("레시피 조회 에러:", err);
                setError("레시피 조회 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [currentPage]);

    return (
        <div>
            <h1>전체 레시피 목록</h1>

            <SearchResultList
                searchValue=""
                searchResults={recipeData}
                loading={loading}
                error={error}
            />

            <div style={{ margin: "20px", textAlign: "center" }}>
                <button
                    onClick={() => {
                        setCurrentPage((p) => p - 1);
                        setPageOffset(-1);
                    }}
                    disabled={currentPage === 1}
                    style={{ marginRight: "10px", padding: "8px 16px" }}
                >
                    이전
                </button>
                <span>페이지: {currentPage}</span>
                <button
                    onClick={() => {
                        setCurrentPage((p) => p + 1);
                        setPageOffset(1);
                    }}
                    disabled={!recipeData || recipeData.recipes.length === 0}
                    style={{ marginLeft: "10px", padding: "8px 16px" }}
                >
                    다음
                </button>
            </div>
        </div>
    );
}
