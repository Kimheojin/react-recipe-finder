import {
    Combobox,
    Portal,
    Button,
    createListCollection,
} from "@chakra-ui/react";
import "./SearchBox.css";
import { useSearchStore } from "../stores/searchStore";
import { container } from "tsyringe";
import AutocompleteRepository from "../repository/autocomplete/AutocompleteRepository";
import { useState, useEffect, useMemo } from "react";
import IntegratedSearchRepository from "../repository/integrated/IntegratedSearchRepository";

export default function SearchBox() {
    const AUTOCOMPLETE_REPO = container.resolve(AutocompleteRepository);
    const INTEGRATEDSEARCH_REPO = container.resolve(IntegratedSearchRepository);
    const [currentInput, setCurrentInput] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState<string[]>(
        []
    );

    // 상태?
    const searchValue = useSearchStore((state) => state.searchValue);
    const settings = useSearchStore((state) => state.settings);

    // 변경 함수
    const setSearchValue = useSearchStore((state) => state.setSearchValue);
    const updateSetting = useSearchStore((state) => state.updateSetting);

    const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
        setCurrentInput(details.inputValue);
    };

    // 0.5초 디바운싱으로 자동완성 실행
    useEffect(() => {
        if (currentInput.trim() === "") return;

        const timer = setTimeout(async () => {
            try {
                if (settings.autocompleteType == "recipename") {
                    // recipename 기반
                    const result =
                        await AUTOCOMPLETE_REPO.recipeNameAutocomoplete(
                            currentInput
                        );
                    const names = result.autocompleteRecipeNameDtoList.map(
                        (item) => item.recipeName
                    );
                    setAutocompleteResults(names);
                } else {
                    // 재료명 기반
                    const result =
                        await AUTOCOMPLETE_REPO.ingredientAutocomplete(
                            currentInput
                        );
                    const names = result.autocompleteDtoList.map(
                        (item) => item.ingredient
                    );
                    setAutocompleteResults(names);
                }
            } catch (error) {
                console.error("자동완성 에러:", error);
                setAutocompleteResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [currentInput, settings.autocompleteType]);

    const handleSearch = () => {
        setSearchValue(currentInput);
        console.log("검색 실행:", currentInput);
    };

    const handleValueChange = (details: Combobox.ValueChangeDetails) => {
        if (details.value.length > 0) {
            setCurrentInput(details.value[0]);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    };

    const collection = useMemo(
        () => createListCollection({ items: autocompleteResults }),
        [autocompleteResults]
    );
    return (
        <Combobox.Root
            collection={collection}
            onInputValueChange={handleInputChange}
            onValueChange={handleValueChange}
            inputValue={currentInput}
        >
            <div className="search-seo">
                <Combobox.Label>
                    {settings.autocompleteType === "recipename"
                        ? "레시피 검색"
                        : "재료 검색"}
                </Combobox.Label>
                <div className="search-controls">
                    <Combobox.Control>
                        <Combobox.Input
                            placeholder={
                                settings.autocompleteType === "recipename"
                                    ? "레시피 이름을 입력하세요"
                                    : "재료 이름을 입력하세요"
                            }
                            onKeyDown={handleKeyDown}
                        />
                        <Combobox.IndicatorGroup>
                            <Combobox.ClearTrigger />
                        </Combobox.IndicatorGroup>
                    </Combobox.Control>
                    <Button onClick={handleSearch}>검색</Button>
                </div>
            </div>

            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>
                            일치하는 항목이 없습니다
                        </Combobox.Empty>
                        {collection.items.map((item) => (
                            <Combobox.Item key={item} item={item}>
                                <Combobox.ItemText>{item}</Combobox.ItemText>
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
}
