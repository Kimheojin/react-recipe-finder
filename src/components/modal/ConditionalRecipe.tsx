import { useSearchStore } from "../../stores/searchStore";
import type { SearchType } from "../../entity/types/search";

export default function ConditionalRecipe() {
    // 값 관련
    const settings = useSearchStore((state) => state.settings);

    // 값 변경 관련
    const updateSetting = useSearchStore((state) => state.updateSetting);

    const searchTypeOptions: { value: SearchType; label: string }[] = [
        { value: "recipename", label: "레시피명" },
        { value: "ingredient", label: "재료명" },
        { value: "cookingorderlist", label: "조리순서" },
    ];

    return (
        <div className="radio-group-root">
            <div className="hstack">
                {searchTypeOptions.map((option) => (
                    <label key={option.value} className="radio-group-item">
                        <input
                            type="radio"
                            name="searchType"
                            value={option.value}
                            checked={settings.searchType === option.value}
                            onChange={(e) =>
                                updateSetting(
                                    "searchType",
                                    e.target.value as SearchType
                                )
                            }
                        />
                        <span className="radio-group-item-text">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
