import { create } from "zustand";
import { container } from "tsyringe";
import BasicSearchRepository from "../repository/basicSearch/BasicSearchRepository";
import type ListRecipeResponse from "../entity/basicSearch/response/ListRecipeResponse";

const TTL_MS = 60_000;

interface RecipeListCacheStore {
    page1Data: ListRecipeResponse | null;
    totalCount: number;
    lastObjectId: string;
    fetchedAt: number | null;
    isFetching: boolean;
    isCacheFresh: () => boolean;
    prefetchFirstPage: () => Promise<void>;
}

export const useRecipeListCacheStore = create<RecipeListCacheStore>(
    (set, get) => ({
        page1Data: null,
        totalCount: 0,
        lastObjectId: "",
        fetchedAt: null,
        isFetching: false,
        isCacheFresh: () => {
            const { fetchedAt } = get();
            return fetchedAt !== null && Date.now() - fetchedAt < TTL_MS;
        },
        prefetchFirstPage: async () => {
            if (get().isFetching || get().isCacheFresh()) return;

            set({ isFetching: true });
            try {
                const basicSearchRepo = container.resolve(BasicSearchRepository);
                const [pageData, countData] = await Promise.all([
                    basicSearchRepo.getPagingRecipe(0, 10, ""),
                    basicSearchRepo.getRecipeCount(),
                ]);

                const lastRecipe = pageData.recipes?.length
                    ? pageData.recipes[pageData.recipes.length - 1]
                    : null;

                set({
                    page1Data: pageData,
                    totalCount: countData.recipeCount,
                    lastObjectId: lastRecipe ? lastRecipe.objectId : "",
                    fetchedAt: Date.now(),
                });
            } catch (err) {
                console.error("레시피 첫 페이지 프리페치 에러:", err);
            } finally {
                set({ isFetching: false });
            }
        },
    })
);
