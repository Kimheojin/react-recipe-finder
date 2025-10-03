import SearchSettingsModal from "./modal/SearchSettingsModal";
import ViewAllbutton from "./modal/ViewAllButton";
import "./RightTopHeader.css";

export default function RightTopHeader() {
    return (
        <div className="right-top-header">
            <ViewAllbutton />
            <SearchSettingsModal />
        </div>
    );
}
