import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";
import type SingleRecipeResponse from "../entity/data/recipe/SingleRecipeResponse";

interface SearchResultListProps {
    searchValue: string;
    searchResults: ListSearchRecipeResponse | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}

function RecipeCard({ recipe }: { recipe: SingleRecipeResponse }) {
    return (
        <>
            <div
                key={recipe.objectId}
                style={{
                    border: "1px solid #ccc",
                    margin: "10px",
                    padding: "10px",
                }}
            >
                <h3>{recipe.recipeName}</h3>
                <p>출처: {recipe.siteIndex}</p>
                <p>출처 url: {recipe.sourceUrl}</p>
                <div>
                    <h4>재료:</h4>
                    <ul>
                        {recipe.ingredientList?.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4>조리순서:</h4>
                    <ol>
                        {recipe.cookingOrderList?.map((step) => (
                            <li key={step.step}>{step.instruction}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </>
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
    if (loading) {
        return <p>검색 중...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (
        !searchResults ||
        !searchResults.recipes ||
        searchResults.recipes.length === 0
    ) {
        return <p>검색 결과가 없습니다.</p>;
    }

    return (
        <div>
            <h2>검색 결과 (전체 {searchResults.totalCount}개)</h2>
            <h2>검색어 : ({searchValue}) </h2>
            {searchResults.recipes.map((recipe) => (
                <RecipeCard key={recipe.objectId} recipe={recipe} />
            ))}

            {/* 페이지네이션 */}
            <div style={{ margin: "20px", textAlign: "center" }}>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ margin: "0 5px", padding: "5px 10px" }}
                >
                    이전
                </button>
                <span style={{ margin: "0 10px" }}>
                    {currentPage} / {searchResults.totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === searchResults.totalPages}
                    style={{ margin: "0 5px", padding: "5px 10px" }}
                >
                    다음
                </button>
            </div>
        </div>
    );
}
