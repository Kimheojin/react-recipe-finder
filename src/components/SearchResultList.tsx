import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";
import type SingleRecipeResponse from "../entity/data/recipe/SingleRecipeResponse";

interface SearchResultListProps {
    searchValue: string;
    searchResults: ListSearchRecipeResponse | null;
    loading: boolean;
    error: string | null;
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
            <h2>검색 결과 ({searchResults.recipes.length}개)</h2>
            <h2>검색어 : ({searchValue}) </h2>
            {searchResults.recipes.map((recipe) => (
                <RecipeCard key={recipe.objectId} recipe={recipe} />
            ))}
        </div>
    );
}
