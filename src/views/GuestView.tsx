import { useEffect, useState } from "react";
import { container } from "tsyringe";
import SearchHeader from "../components/header/SearchHeader";
import SearchResultList from "../components/SearchResultList";
import ScrollToTopButton from "../components/ScrollToTopButton";
import GuestRepository from "../repository/guest/GuestRepository";
import BasicSearchRepository from "../repository/basicSearch/BasicSearchRepository";
import type ListSearchRecipeResponse from "../entity/integratedSearch/response/ListSearchRecipeResponse";
import type SingleRecipeResponse from "../entity/data/recipe/SingleRecipeResponse";

type TabType = "likes" | "bookmarks";

export default function GuestView() {
  const GUEST_REPO = container.resolve(GuestRepository);
  const BASIC_SEARCH_REPO = container.resolve(BasicSearchRepository);

  const [activeTab, setActiveTab] = useState<TabType>("likes");
  const [recipes, setRecipes] = useState<SingleRecipeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 탭에 따른 가짜 검색 결과 생성
  const searchResults: ListSearchRecipeResponse = {
    totalCount: recipes.length,
    totalPages: 1,
    currentPage: 1,
    pageSize: recipes.length,
    recipes: recipes,
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      let ids: string[] = [];
      if (activeTab === "likes") {
        const response = await GUEST_REPO.getLikeList();
        ids = response.recipeIds;
      } else {
        const response = await GUEST_REPO.getBookmarkList();
        ids = response.recipeIds;
      }

      if (ids.length === 0) {
        setRecipes([]);
        return;
      }

      // 각 ID에 대해 상세 정보 가져오기 (병렬 처리)
      const detailPromises = ids.map((id) =>
        BASIC_SEARCH_REPO.getSingleRecipe(id).catch((err) => {
          console.error(`레시피 ${id} 로드 실패:`, err);
          return null;
        })
      );

      const details = await Promise.all(detailPromises);
      const validDetails = details.filter(
        (d): d is SingleRecipeResponse => d !== null
      );

      setRecipes(validDetails);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [activeTab]);

  return (
    <div className="space-y-8 pb-20">
      <SearchHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* 탭 메뉴 */}
        <div className="flex gap-4 border-b border-[#eef0f4] mb-8">
          <button
            onClick={() => setActiveTab("likes")}
            className={`pb-4 text-sm font-bold transition-all ${
              activeTab === "likes"
                ? "border-b-2 border-[#2f5bda] text-[#2f5bda]"
                : "text-[#5d636f] hover:text-[#121417]"
            }`}
          >
            좋아요한 레시피
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`pb-4 text-sm font-bold transition-all ${
              activeTab === "bookmarks"
                ? "border-b-2 border-[#2f5bda] text-[#2f5bda]"
                : "text-[#5d636f] hover:text-[#121417]"
            }`}
          >
            북마크한 레시피
          </button>
        </div>

        <SearchResultList
          searchValue={activeTab === "likes" ? "좋아요한 레시피" : "북마크한 레시피"}
          searchResults={searchResults}
          loading={loading}
          error={error}
          currentPage={1}
          onPageChange={() => {}}
          onStatusChange={fetchRecipes}
        />
      </main>

      <ScrollToTopButton />
    </div>
  );
}
