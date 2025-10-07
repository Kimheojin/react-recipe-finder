import SearchBox from "./SearchBox";
import LeftTopHeader from "./LeftTopHeader";
import RightTopHeader from "./RightTopHeader";
import { useSearchStore } from "../stores/searchStore";
import "./SearchHeader.css";

export default function SearchHeader() {
    const state2 = useSearchStore((state) => state.settings);

    const searchTypeMap: Record<string, string> = {
        recipename: "레시피 명",
        ingredient: "재료명",
        cookingorderlist: "조리 순서",
    };

    const autocompleteTypeMap: Record<string, string> = {
        recipename: "레시피 명",
        ingredient: "재료명",
        none: "없음",
    };

    return (
        <div className="search-header">
            <div className="search-header-top">
                <LeftTopHeader />
                <SearchBox />
                <RightTopHeader />
            </div>

            <div className="search-header-footer">
                통합검색 타입 :{" "}
                {searchTypeMap[state2.searchType] || state2.searchType} /
                자동완성 타입 :{" "}
                {autocompleteTypeMap[state2.autocompleteType] ||
                    state2.autocompleteType}
            </div>
        </div>
    );
}
