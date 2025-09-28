import SearchInput from "../components/SearchInput";
import ConditionalRecipe from "../components/ConditionalRecipe";

import { useState } from "react";

export default function HomeView() {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <h1>HomeView + 라우터 부분</h1>
            <SearchInput />

            <div>
                <ConditionalRecipe />
            </div>
        </>
    );
}
