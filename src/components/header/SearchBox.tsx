import * as Form from "@radix-ui/react-form";
import * as Popover from "@radix-ui/react-popover";
import { LuSearch } from "react-icons/lu";
import { useSearchStore } from "../../stores/searchStore";
import { container } from "tsyringe";
import AutocompleteRepository from "../../repository/autocomplete/AutocompleteRepository";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
    const AUTOCOMPLETE_REPO = container.resolve(AutocompleteRepository);
    const [currentInput, setCurrentInput] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState<string[]>(
        []
    );
    const [activeIndex, setActiveIndex] = useState(-1);
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
        setActiveIndex(-1);
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
        if (
            settings.autocompleteType !== "none" &&
            autocompleteResults.length > 0
        ) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((prevIndex) =>
                    prevIndex === autocompleteResults.length - 1
                        ? 0
                        : prevIndex + 1
                );
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((prevIndex) =>
                    prevIndex <= 0
                        ? autocompleteResults.length - 1
                        : prevIndex - 1
                );
            } else if (event.key === "Enter") {
                event.preventDefault();
                if (activeIndex > -1) {
                    handleValueChange({
                        value: [autocompleteResults[activeIndex]],
                    });
                } else {
                    handleSearch();
                }
            } else if (event.key === "Escape") {
                event.preventDefault();
                setAutocompleteResults([]);
            }
        } else if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    };
    return (
        <div className="combobox-root">
            <Popover.Root
                open={
                    settings.autocompleteType !== "none" &&
                    autocompleteResults.length > 0 &&
                    currentInput.length > 0
                }
            >
                <Popover.Trigger asChild>
                    <Form.Root
                        onSubmit={(event) => {
                            handleSearch();
                            event.preventDefault();
                        }}
                    >
                        <Form.Field
                            name="search"
                            className="flex flex-row justify-center items-center gap-[12px] w-[384px]"
                        >
                            <Form.Control asChild>
                                <input
                                    className="h-[20px] px-[12px] border-[2px] border-gray-300 rounded-[8px] combobox-input w-full"
                                    placeholder={
                                        settings.autocompleteType ===
                                        "recipename"
                                            ? "레시피 이름을 입력하세요"
                                            : settings.autocompleteType ===
                                              "ingredient"
                                            ? "재료 이름을 입력하세요"
                                            : "검색어를 입력하세요"
                                    }
                                    onKeyDown={handleKeyDown}
                                    value={currentInput}
                                    onChange={(e) =>
                                        handleInputChange({
                                            inputValue: e.target.value,
                                        })
                                    }
                                />
                            </Form.Control>
                            <Form.Submit asChild>
                                <button
                                    aria-label="Search database"
                                    className="h-[20px] px-[12px] border-[2px] border-gray-300 rounded-[8px] icon-button"
                                >
                                    <LuSearch />
                                </button>
                            </Form.Submit>
                        </Form.Field>
                    </Form.Root>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        sideOffset={5}
                        className="combobox-content w-[384px] min-w-[384px] bg-white border border-gray-200 rounded-md shadow-lg"
                    >
                        {autocompleteResults.map((item, index) => (
                            <div
                                key={item}
                                className={`combobox-item`}
                                style={{ backgroundColor: index === activeIndex ? 'lightgray' : 'white', color: index === activeIndex ? 'black' : 'inherit' }}
                                onClick={() =>
                                    handleValueChange({ value: [item] })
                                }
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <span className="combobox-item-text">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
}
