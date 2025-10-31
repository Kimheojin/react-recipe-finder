import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";
import type SingleRecipeResponse from "../entity/data/recipe/SingleRecipeResponse";
import { useLocation } from "react-router-dom";

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
        <div className="border border-gray-300 m-2.5 p-2.5" key={recipe.objectId}>
            <h3 className="mt-0">{recipe.recipeName}</h3>
            <p>
                출처 url:{" "}
                <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {recipe.sourceUrl}
                </a>
            </p>
            <div className="recipe-ingredients">
                <p>
                    <strong>재료:</strong> {recipe.ingredientList?.join(", ")}
                </p>
            </div>
            <div className="recipe-cooking-order">
                <h4 className="mb-2">조리순서:</h4>
                <ol className="m-0 pl-5">
                    {recipe.cookingOrderList?.map((step) => (
                        <li key={step.step}>
                            {step.step}. {step.instruction}
                        </li>
                    ))}
                </ol>
            </div>
            <p>출처 index: {recipe.siteIndex}</p>
        </div>
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
        return <p>검색 중...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
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
            {!isRecipesPage && (
                <div className="m-5 text-center">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="mx-1 px-2.5 py-1.5"
                    >
                        이전
                    </button>
                    <span className="mx-2.5">
                        {currentPage} / {searchResults.totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === searchResults.totalPages}
                        className="mx-1 px-2.5 py-1.5"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}
