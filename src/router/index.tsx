import { Routes, Route } from "react-router-dom";
import HomeView from "../views/HomeView";
import SearchListView from "../views/SearchListView";
import RecipeListView from "../views/RecipeListView";
import GuestView from "../views/GuestView";

export function AppRoutes() {
    // 기본 검색 페에지 +  component 는 그냥 재활용 한단 생각으로
    return (
        <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/search-results" element={<SearchListView />} />
            <Route path="/recipes" element={<RecipeListView />} />
            <Route path="/guest" element={<GuestView />} />
        </Routes>
    );
}
