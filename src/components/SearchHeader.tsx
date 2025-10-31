import SearchBox from "./SearchBox";
import LeftTopHeader from "./LeftTopHeader";
import RightTopHeader from "./RightTopHeader";
import { useSearchStore } from "../stores/searchStore";

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
        <div className="flex flex-col my-2.5 w-full">
            <div className="grid grid-cols-3 items-center gap-8 mb-2.5">
                <div className="justify-self-start self-end">
                    <LeftTopHeader />
                </div>
                <div className="justify-self-center">
                    <SearchBox />
                </div>
                <div className="justify-self-end self-end">
                    <RightTopHeader />
                </div>
            </div>

            <div className="flex justify-center">
                통합검색 타입 :{" "}
                {searchTypeMap[state2.searchType] || state2.searchType} /
                자동완성 타입 :{" "}
                {autocompleteTypeMap[state2.autocompleteType] ||
                    state2.autocompleteType}
            </div>
        </div>
    );
}
