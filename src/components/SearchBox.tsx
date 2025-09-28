import {
    Combobox,
    Portal,
    useFilter,
    useListCollection,
    Button,
} from "@chakra-ui/react";
import "./SearchBox.css";

export default function SearchBox() {
    const { contains } = useFilter({ sensitivity: "base" });

    const { collection, filter } = useListCollection({
        initialItems: countries,
        itemToString: (item) => item.country,
        itemToValue: (item) => item.code,
        filter: contains,
    });

    const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
        filter(details.inputValue);
    };

    return (
        <Combobox.Root
            collection={collection}
            onInputValueChange={handleInputChange}
        >
            <div className="search-seo">
                <Combobox.Label>Search Countries</Combobox.Label>
                <div className="search-controls">
                    <Combobox.Control>
                        <Combobox.Input placeholder="e.g. United States" />
                        <Combobox.IndicatorGroup>
                            <Combobox.ClearTrigger />
                        </Combobox.IndicatorGroup>
                    </Combobox.Control>
                    <Button>검색</Button>
                </div>
            </div>

            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>일치하는 항목이 X</Combobox.Empty>

                        {collection.items.map((item) => (
                            <Combobox.Item key={item.code} item={item}>
                                {item.country}
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
}

const countries = [
    { country: "United States", code: "US", flag: "🇺🇸" },
    { country: "Canada", code: "CA", flag: "🇨🇦" },
];
