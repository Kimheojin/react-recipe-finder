import SearchBox from "./SearchBox";
import LeftTopHeader from "./LeftTopHeader";
import RightTopHeader from "./RightTopHeader";
import { useSearchStore } from "../stores/searchStore";
import "./SearchHeader.css";

export default function SearchHeader() {
    const state2 = useSearchStore((state) => state.settings);
    return (
        <div className="search-header">
            <div className="search-header-top">
                <LeftTopHeader />
                <SearchBox />
                <RightTopHeader />
            </div>

            <div className="search-header-footer">
                통합검색 타입 : {state2.searchType} 자동완성 타입 :{" "}
                {state2.autocompleteType}
            </div>
        </div>
    );
}
