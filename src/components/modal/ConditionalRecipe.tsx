import { HStack, RadioCard } from "@chakra-ui/react";

const items = [
    { value: "ingredient", title: "재료명 기반" },
    { value: "recipeName", title: "레시피명 기반" },
    { value: "cookingOrderList", title: "요리 순서" },
];
export default function ConditionalRecipe() {
    return (
        <RadioCard.Root defaultValue="next">
            <RadioCard.Label>통합 검색 설정</RadioCard.Label>
            <HStack align="stretch">
                {items.map((item) => (
                    <RadioCard.Item key={item.value} value={item.value}>
                        <RadioCard.ItemHiddenInput />
                        <RadioCard.ItemControl>
                            <RadioCard.ItemText>
                                {item.title}
                            </RadioCard.ItemText>
                            <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                    </RadioCard.Item>
                ))}
            </HStack>
        </RadioCard.Root>
    );
}
