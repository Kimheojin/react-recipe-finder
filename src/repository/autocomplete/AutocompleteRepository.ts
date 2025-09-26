import { inject, singleton } from "tsyringe";
import HttpRepository from "../http/HttpRepository";
import type RecipeNameListDto from "../../entity/autocomplete/response/RecipeNameListDto";
import type IngredientNameListDto from "../../entity/autocomplete/response/IngredientNameListDto";

@singleton()
export default class AutocompleteRepository {
    constructor(
        @inject(HttpRepository)
        private readonly httpRepository: HttpRepository
    ) {}
    // 재료명 기반 자동완성
    public async ingredientAutocomplete(
        term: string
    ): Promise<IngredientNameListDto> {
        return this.httpRepository.get<IngredientNameListDto>({
            path: "/seo/autocomplete/ingredient",
            params: {
                term,
            },
        });
    }

    // recipeName 기반 자동완성
    public async recipeNameAutocomoplete(
        term: string
    ): Promise<RecipeNameListDto> {
        return this.httpRepository.get<RecipeNameListDto>({
            path: "/seo/autocomplete/recipename",
            params: {
                term,
            },
        });
    }
}
