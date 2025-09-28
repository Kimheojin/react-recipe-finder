import { Button, CloseButton, Dialog, Portal, VStack } from "@chakra-ui/react";
import ConditionalRecipe from "./modal/ConditionalRecipe";
import AutocompleteSwitch from "./modal/AutocompleteSwitch";
import ViewAllbutton from "./modal/ViewAllButton";

export default function SearchSettingsModal() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant="outline" size="sm">
                    검색 설정
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>검색 설정</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap={6} align="center">
                                <ConditionalRecipe />
                                <AutocompleteSwitch />
                                <ViewAllbutton />
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">취소</Button>
                            </Dialog.ActionTrigger>
                            <Button>저장</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
