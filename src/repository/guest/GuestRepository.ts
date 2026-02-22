import { inject, singleton } from "tsyringe";
import HttpRepository from "../http/HttpRepository";
import type MessageResponseDto from "../../entity/guest/response/MessageResponseDto";
import type RecipeLikeListResponseDto from "../../entity/guest/response/RecipeLikeListResponseDto";
import type RecipeBookmarkListResponseDto from "../../entity/guest/response/RecipeBookmarkListResponseDto";
import type RecipeStatusDto from "../../entity/guest/response/RecipeStatusDto";
import type RecipeStatusListResponseDto from "../../entity/guest/response/RecipeStatusListResponseDto";

@singleton()
export default class GuestRepository {
  constructor(
    @inject(HttpRepository)
    private readonly httpRepository: HttpRepository
  ) {}

  // 좋아요 상태 변경 (토글)
  public async toggleLike(recipeId: string): Promise<MessageResponseDto> {
    return this.httpRepository.post<MessageResponseDto>({
      path: "/seo/recipe/like",
      body: {
        recipeId,
      },
    });
  }

  // 북마크 상태 변경 (토글)
  public async toggleBookmark(recipeId: string): Promise<MessageResponseDto> {
    return this.httpRepository.post<MessageResponseDto>({
      path: "/seo/recipe/bookmark",
      body: {
        recipeId,
      },
    });
  }

  // 좋아요 목록 조회
  public async getLikeList(): Promise<RecipeLikeListResponseDto> {
    return this.httpRepository.get<RecipeLikeListResponseDto>({
      path: "/seo/recipe/likes",
    });
  }

  // 북마크 목록 조회
  public async getBookmarkList(): Promise<RecipeBookmarkListResponseDto> {
    return this.httpRepository.get<RecipeBookmarkListResponseDto>({
      path: "/seo/recipe/bookmark",
    });
  }

  // 특정 레시피 상태 확인
  public async getRecipeStatus(recipeId: string): Promise<RecipeStatusDto> {
    const response = await this.httpRepository.get<RecipeStatusListResponseDto>({
      path: "/seo/recipe/status",
      params: { recipeId },
    });
    return response.recipeStatuses[0];
  }

  // 레시피 목록 상태 일괄 확인
  public async getRecipeStatusList(
    recipeIds: string[]
  ): Promise<RecipeStatusListResponseDto> {
    const params = new URLSearchParams();
    recipeIds.forEach((id) => params.append("recipeId", id));

    return this.httpRepository.get<RecipeStatusListResponseDto>({
      path: "/seo/recipe/status",
      params: params,
    });
  }
}
