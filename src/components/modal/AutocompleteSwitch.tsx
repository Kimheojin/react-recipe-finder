import { useSearchStore } from "../../stores/searchStore";
import type { AutocompleteType } from "../../entity/types/search";

export default function AutocompleteSwitch() {
    // 값 관련
    const settings = useSearchStore((state) => state.settings);

    // 값 변경 관련
    const updateSetting = useSearchStore((state) => state.updateSetting);

    const autocompleteOptions: { value: AutocompleteType; label: string }[] = [
        { value: "recipename", label: "레시피명" },
        { value: "ingredient", label: "재료명" },
        { value: "none", label: "자동완성 사용 안함" },
    ];

    return (
        <div className="radio-group-root">
            <div className="hstack">
                {autocompleteOptions.map((option) => (
                    <label key={option.value} className="radio-group-item">
                        <input
                            type="radio"
                            name="autocompleteType"
                            value={option.value}
                            checked={settings.autocompleteType === option.value}
                            onChange={(e) =>
                                updateSetting(
                                    "autocompleteType",
                                    e.target.value as AutocompleteType
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
