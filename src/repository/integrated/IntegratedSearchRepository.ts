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
        page: number,
        pageSize: number,
        term: string
    ): Promise<ListSearchRecipeResponse> {
        return this.httpRepository.get<ListSearchRecipeResponse>({
            path: "/seo/search/ingredient",
            params: {
                page,
                pageSize,
                term,
            },
        });
    }

    // cookingOrdeiList 기반 통합 조회
    public async integratedCookingOrderList(
        page: number,
        pageSize: number,
        term: string
    ): Promise<ListSearchRecipeResponse> {
        return this.httpRepository.get<ListSearchRecipeResponse>({
            path: "/seo/search/cookingorder",
            params: {
                page,
                pageSize,
                term,
            },
        });
    }

    // 레시피명 기반 통합 조회
    public async integratedRecipeName(
        page: number,
        pageSize: number,
        term: string
    ): Promise<ListSearchRecipeResponse> {
        return this.httpRepository.get<ListSearchRecipeResponse>({
            path: "/seo/search/recipename",
            params: {
                page,
                pageSize,
                term,
            },
        });
    }
}
