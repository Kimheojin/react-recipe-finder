import type CookingOrder from "./CookingOrder";

export default interface SingleRecipeResponse {
    objectId: string;
    recipeName: string;
    sourceUrl: string;
    siteIndex: string;
    cookingOrderList: CookingOrder[];
    ingredientList: string[];
}
