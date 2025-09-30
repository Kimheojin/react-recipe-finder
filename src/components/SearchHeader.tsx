import SearchBox from "./SearchBox";
import SearchSettingsModal from "./modal/SearchSettingsModal";
import ViewAllbutton from "./modal/ViewAllButton";
import { useSearchStore } from "../stores/searchStore";
import "./SearchHeader.css";

export default function SearchHeader() {
    const state2 = useSearchStore((state) => state.settings);
    return (
        <div className="search-header">
            <div className="search-header-top">
                <ViewAllbutton />
                <SearchBox />
                <SearchSettingsModal />
            </div>

            <h1>
                자동완성 타입 : {state2.autocompleteType} 통합검색 타입 :{" "}
                {state2.searchType}
            </h1>
        </div>
    );
}
