import { Link, CloseButton, Dialog, Portal, VStack } from "@chakra-ui/react";
import ConditionalRecipe from "./ConditionalRecipe";
import AutocompleteSwitch from "./AutocompleteSwitch";
import "./SearchSettingsModal.css";

export default function SearchSettingsModal() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Link variant="underline">검색 설정</Link>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner className="search-settings-positioner">
                    <Dialog.Content>
                        <Dialog.Header className="search-settings-dialog-header">
                            <Dialog.Title>검색 설정</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap={6} align="center" className="search-settings-header">
                                <h1>통합 검색 조건</h1>
                                <ConditionalRecipe />
                                <h1>자동완성 조건</h1>
                                <AutocompleteSwitch />
                            </VStack>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
