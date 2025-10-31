import { LuSearch } from "react-icons/lu";
import { useSearchStore } from "../stores/searchStore";
import { container } from "tsyringe";
import AutocompleteRepository from "../repository/autocomplete/AutocompleteRepository";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
    const AUTOCOMPLETE_REPO = container.resolve(AutocompleteRepository);
    const [currentInput, setCurrentInput] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState<string[]>(
        []
    );
    const navigate = useNavigate();

    // 상태?
    const settings = useSearchStore((state) => state.settings);

    // 변경 함수
    const setSearchValue = useSearchStore((state) => state.setSearchValue);

    const handleInputChange = (details: { inputValue: string }) => {
        setCurrentInput(details.inputValue);
    };

    // 0.5초 디바운싱으로 자동완성 실행
    useEffect(() => {
        if (
            currentInput.trim() === "" ||
            settings.autocompleteType === "none"
        ) {
            setAutocompleteResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                if (settings.autocompleteType === "recipename") {
                    // recipename 기반
                    const result =
                        await AUTOCOMPLETE_REPO.recipeNameAutocomoplete(
                            currentInput
                        );
                    const sorted = result.autocompleteRecipeNameDtoList.sort(
                        (a, b) => b.score - a.score
                    );
                    const names = sorted.map((item) => item.recipeName);
                    setAutocompleteResults(names);
                } else if (settings.autocompleteType === "ingredient") {
                    // 재료명 기반
                    const result =
                        await AUTOCOMPLETE_REPO.ingredientAutocomplete(
                            currentInput
                        );
                    const sorted = result.autocompleteDtoList.sort(
                        (a, b) => b.score - a.score
                    );
                    const names = sorted.map((item) => item.ingredient);
                    setAutocompleteResults(names);
                }
            } catch (error) {
                console.error("자동완성 에러:", error);
                setAutocompleteResults([]);
            }
        }, 10);

        return () => clearTimeout(timer);
    }, [currentInput, settings.autocompleteType]);

    // 검색 버튼 누를 시
    const handleSearch = (valueToSearch?: string) => {
        const searchTerm = valueToSearch ?? currentInput;
        setSearchValue(searchTerm);
        navigate("/search-results");
        console.log("검색 실행:", searchTerm);
    };

    const handleValueChange = (details: { value: string[] }) => {
        console.log("handleValueChange triggered", details.value);
        if (details.value.length > 0) {
            const selectedValue = details.value[0];
            setCurrentInput(selectedValue);
            handleSearch(selectedValue);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            const activeItem = document.querySelector("[data-active]");
            console.log("Enter pressed. Active item:", activeItem);
            if (!activeItem) {
                console.log("No active item, calling handleSearch()");
                event.preventDefault();
                handleSearch();
            } else {
                console.log("Active item found, letting Combobox handle it.");
            }
        }
    };
    return (
        <div
            className="combobox-root"
        >
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row justify-center items-center gap-2">
                    <div className="combobox-control">
                        <input
                            className="combobox-input"
                            placeholder={
                                settings.autocompleteType === "recipename"
                                    ? "레시피 이름을 입력하세요"
                                    : settings.autocompleteType === "ingredient"
                                    ? "재료 이름을 입력하세요"
                                    : "검색어를 입력하세요"
                            }
                            onKeyDown={handleKeyDown}
                            value={currentInput}
                            onChange={(e) => handleInputChange({ inputValue: e.target.value })}
                        />
                    </div>
                    <button
                        aria-label="Search database"
                        className="icon-button"
                        onClick={() => handleSearch()}
                    >
                        <LuSearch />
                    </button>
                </div>
            </div>

            {settings.autocompleteType !== "none" && autocompleteResults.length > 0 && (
                <div className="combobox-content">
                    {autocompleteResults.map((item) => (
                        <div key={item} className="combobox-item" onClick={() => handleValueChange({ value: [item] })}>
                            <span className="combobox-item-text">{item}</span>
                        </div>
                    ))}
                </div>
            )}
            {settings.autocompleteType !== "none" && autocompleteResults.length === 0 && currentInput.length > 0 && (
                <div className="combobox-empty">
                    일치하는 항목이 없습니다
                </div>
            )}
        </div>
    );
}
