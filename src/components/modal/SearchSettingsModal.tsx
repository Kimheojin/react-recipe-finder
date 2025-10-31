import * as Dialog from '@radix-ui/react-dialog';
import ConditionalRecipe from "./ConditionalRecipe";
import AutocompleteSwitch from "./AutocompleteSwitch";

export default function SearchSettingsModal() {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <a className="link cursor-pointer underline">검색 설정</a>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg border border-gray-300 w-[384px] min-w-[384px]" style={{ backgroundColor: 'white' }}>
                    <div className="dialog-header m-2.5">
                        <Dialog.Title className="dialog-title">검색 설정</Dialog.Title>
                    </div>
                    <div className="dialog-body">
                        <div className="vstack mb-10">
                            <h1 className="text-lg font-semibold">통합 검색 조건</h1>
                            <ConditionalRecipe />
                            <h1 className="text-lg font-semibold">자동완성 조건</h1>
                            <AutocompleteSwitch />
                        </div>
                    </div>
                    <Dialog.Close asChild>
                        <button className="close-button">X</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}