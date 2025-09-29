import { HStack, RadioGroup } from "@chakra-ui/react";
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
    ];

    return (
        <RadioGroup.Root
            value={settings.autocompleteType}
            onValueChange={(details) => updateSetting("autocompleteType", details.value as AutocompleteType)}
        >
            <HStack gap="6">
                {autocompleteOptions.map((option) => (
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
