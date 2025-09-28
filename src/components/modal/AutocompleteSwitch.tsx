import { HStack, RadioGroup } from "@chakra-ui/react";

const items = [
    { label: "재료명 기반", value: "1" },
    { label: "레시피명 기반", value: "2" },
    { label: "자동완성 끄기", value: "3" },
];
export default function AutocompleteSwitch() {
    return (
        <RadioGroup.Root defaultValue="1">
            <HStack gap="6">
                {items.map((item) => (
                    <RadioGroup.Item key={item.value} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                ))}
            </HStack>
        </RadioGroup.Root>
    );
}
