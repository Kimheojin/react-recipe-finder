import { inject, singleton } from "tsyringe";
import HttpRepository from "../http/HttpRepository";
import type SingleRecipeResponse from "../../entity/basicSearch/response/SingleRecipeResponse";
import type ListRecipeResponse from "../../entity/basicSearch/response/ListRecipeResponse";

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
            path: "/seo/basic/recipe",
            params: {
                page,
                pageSize,
                objectId,
            },
        });
    }
}
