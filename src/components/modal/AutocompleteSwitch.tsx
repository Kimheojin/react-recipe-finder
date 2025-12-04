import { useSearchStore } from "../../stores/searchStore";
import type { AutocompleteType } from "../../entity/types/search";

export default function AutocompleteSwitch() {
  const settings = useSearchStore((state) => state.settings);
  const updateSetting = useSearchStore((state) => state.updateSetting);

  const autocompleteOptions: { value: AutocompleteType; label: string }[] = [
    { value: "recipename", label: "레시피명" },
    { value: "ingredient", label: "재료명" },
    { value: "none", label: "자동완성 사용 안함" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {autocompleteOptions.map((option) => {
        const isActive = settings.autocompleteType === option.value;

        return (
          <label
            key={option.value}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-transparent bg-[#0f956a] text-white"
                : "border-[#d7dbe2] text-[#5d636f] hover:border-[#b6bdc9]"
            }`}
          >
            <input
              type="radio"
              name="autocompleteType"
              value={option.value}
              checked={isActive}
              onChange={(e) =>
                updateSetting("autocompleteType", e.target.value as AutocompleteType)
              }
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
