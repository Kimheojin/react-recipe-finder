import { useSearchStore } from "../../stores/searchStore";
import type { SearchType } from "../../entity/types/search";

export default function ConditionalRecipe() {
  const settings = useSearchStore((state) => state.settings);
  const updateSetting = useSearchStore((state) => state.updateSetting);

  const searchTypeOptions: { value: SearchType; label: string }[] = [
    { value: "recipename", label: "레시피명" },
    { value: "ingredient", label: "재료명" },
    { value: "cookingorderlist", label: "조리순서" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {searchTypeOptions.map((option) => {
        const isActive = settings.searchType === option.value;

        return (
          <label
            key={option.value}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-transparent bg-[#2f5bda] text-white"
                : "border-[#d7dbe2] text-[#5d636f] hover:border-[#b6bdc9]"
            }`}
          >
            <input
              type="radio"
              name="searchType"
              value={option.value}
              checked={isActive}
              onChange={(e) =>
                updateSetting("searchType", e.target.value as SearchType)
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
