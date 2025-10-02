import type SingleRecipeResponse from "../../data/recipe/SingleRecipeResponse";

export default interface ListSearchRecipeResponse {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    recipes: SingleRecipeResponse[];
}
