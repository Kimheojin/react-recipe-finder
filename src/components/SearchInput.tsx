import { Button, Input } from "@chakra-ui/react";
import "./SearchInput.css";
import AutocompleteSwitch from "./AutocompleteSwitch";
import ComboBox from "./SearchBox";

export default function SearchInput() {
    return (
        <>
            <div className="search-container"></div>
            <ComboBox />
            <AutocompleteSwitch />
        </>
    );
}
