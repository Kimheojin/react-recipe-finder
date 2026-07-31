import { useEffect } from "react";
import SearchHeader from "../components/header/SearchHeader";
import { useRecipeListCacheStore } from "../stores/recipeListCacheStore";

export default function HomeView() {
  useEffect(() => {
    useRecipeListCacheStore.getState().prefetchFirstPage();
  }, []);

  return (
    <div>
      <SearchHeader />
    </div>
  );
}
