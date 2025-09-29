import { Button, CloseButton, Dialog, Portal, VStack } from "@chakra-ui/react";
import ConditionalRecipe from "./ConditionalRecipe";
import AutocompleteSwitch from "./AutocompleteSwitch";


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
