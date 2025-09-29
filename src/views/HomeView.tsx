import SearchBox from "../components/SearchBox";
import SearchSettingsModal from "../components/modal/SearchSettingsModal";
import ViewAllbutton from "../components/modal/ViewAllButton";
import { useSearchStore } from "../stores/searchStore";

export default function HomeView() {
    const state2 = useSearchStore((state) => state.settings);
    return (
        <>
            <h1>
                자동완성 타입 : {state2.autocompleteType} 통합검색 타입 :{" "}
                {state2.searchType}
            </h1>
            <ViewAllbutton />
            <SearchBox />
            <SearchSettingsModal />
        </>
    );
}
