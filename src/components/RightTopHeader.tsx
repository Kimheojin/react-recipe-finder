import SearchSettingsModal from "./modal/SearchSettingsModal";
import ViewAllbutton from "./modal/ViewAllButton";

export default function RightTopHeader() {
    return (
        <div className="flex gap-3 items-end mr-2.5">
            <ViewAllbutton />
            <SearchSettingsModal />
        </div>
    );
}
