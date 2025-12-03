import SearchBox from "./SearchBox";
import SearchSettingsModal from "../modal/SearchSettingsModal";
import ViewAllbutton from "../modal/ViewAllButton";

export default function SearchHeader() {
    return (
        <header className="flex flex-col gap-4 border border-gray-200 rounded-md p-5 mb-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">레시피 검색</h1>
                <ViewAllbutton />
            </div>
            <div className="flex flex-col gap-2">
                <SearchBox />
                <div className="text-sm text-right">
                    <SearchSettingsModal />
                </div>
            </div>
        </header>
    );
}
