import { HStack, RadioGroup } from "@chakra-ui/react";
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
        <RadioGroup.Root
            value={settings.searchType}
            onValueChange={(details) => updateSetting("searchType", details.value as SearchType)}
        >
            <HStack gap="6">
                {searchTypeOptions.map((option) => (
                    <RadioGroup.Item key={option.value} value={option.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                ))}
            </HStack>
        </RadioGroup.Root>
    );
}
