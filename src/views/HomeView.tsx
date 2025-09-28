import SearchInput from "../components/SearchInput";
import SearchSettingsModal from "../components/SearchSettingsModal";

import { useState } from "react";

export default function HomeView() {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <h1>HomeView + 라우터 부분</h1>
            <SearchInput />
            <SearchSettingsModal />
        </>
    );
}
