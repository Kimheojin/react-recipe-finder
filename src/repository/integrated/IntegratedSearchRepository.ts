import { inject, singleton } from "tsyringe";
import HttpRepository from "../http/HttpRepository";
import type ListSearchRecipeResponse from "../../entity/integratedSearch/response/ListSearchRecipeResponse";

@singleton()
export default class IntegratedSearchRepository {
    constructor(
        @inject(HttpRepository)
        private readonly httpRepository: HttpRepository
    ) {}

    // 재료명 기반 통합 조회
    public async integratedIngredient(
        term: string
    ): Promise<ListSearchRecipeResponse> {
        return this.httpRepository.get<ListSearchRecipeResponse>({
            path: "/seo/search/ingredient",
            params: {
                term,
            },
        });
    }

    // cookingOrdeiList 기반 통합 조회
    public async integratedCookingOrderList(
        term: string
    ): Promise<ListSearchRecipeResponse> {
        return this.httpRepository.get<ListSearchRecipeResponse>({
            path: "/seo/search/cookingorder",
            params: {
                term,
            },
        });
    }

    // 레시피명 기반 통합 조회
    public async integratedRecipeName(
        term: string
    ): Promise<ListSearchRecipeResponse> {
        return this.httpRepository.get<ListSearchRecipeResponse>({
            path: "/seo/search/recipename",
            params: {
                term,
            },
        });
    }
}
