import { inject, singleton } from "tsyringe";
import HttpRepository from "../http/HttpRepository";
import type SingleRecipeResponse from "../../entity/data/recipe/SingleRecipeResponse";
import type ListRecipeResponse from "../../entity/basicSearch/response/ListRecipeResponse";
import type RecipeCount from "../../entity/basicSearch/response/RecipeCount";

@singleton()
export default class BasicSearchRepository {
    constructor(
        @inject(HttpRepository)
        private readonly httpRepository: HttpRepository
    ) {}

    // 단일 레시피 조회
    public async getSingleRecipe(
        objectId: string
    ): Promise<SingleRecipeResponse> {
        return this.httpRepository.get<SingleRecipeResponse>({
            path: "/seo/basic/recipe",
            params: {
                objectId,
            },
        });
    }
    // 페이징 레시피 조회
    public async getPagingRecipe(
        page: Number,
        pageSize: Number,
        objectId: string
    ): Promise<ListRecipeResponse> {
        return this.httpRepository.get<ListRecipeResponse>({
            path: "/seo/basic/recipes",
            params: {
                page,
                pageSize,
                objectId,
            },
        });
    }

    // 전체 레시피 갯수 조회
    public async getRecipeCount(): Promise<RecipeCount> {
        return this.httpRepository.get<RecipeCount>({
            path: "/seo/basic/recipescount",
        });
    }
}
