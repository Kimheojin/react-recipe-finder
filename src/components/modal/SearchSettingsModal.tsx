import * as Dialog from "@radix-ui/react-dialog";
import { LuX } from "react-icons/lu";
import AutocompleteSwitch from "./AutocompleteSwitch";
import ConditionalRecipe from "./ConditionalRecipe";

export default function SearchSettingsModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-sm font-semibold text-[#2f5bda] underline-offset-2 hover:underline">
          검색 설정
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 bg-black/25" />
        <Dialog.Content className="dialog-content surface-card fixed left-1/2 top-1/2 w-[420px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 p-6 shadow-xl">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold text-[#121417]">
                검색 설정
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-[#5d636f]">
                원하는 조건을 선택해 검색 결과를 더 정교하게 맞춰보세요.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="닫기"
                className="rounded-full border border-[#d7dbe2] p-2 text-[#5d636f] transition hover:border-[#b6bdc9]"
              >
                <LuX />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8a909d]">
                통합 검색 조건
              </h2>
              <p className="mt-1 text-sm text-[#5d636f]">
                찾아보고 싶은 기준을 골라주세요.
              </p>
              <div className="mt-4">
                <ConditionalRecipe />
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8a909d]">
                자동완성 옵션
              </h2>
              <p className="mt-1 text-sm text-[#5d636f]">
                입력 중에 받고 싶은 추천 방식을 지정할 수 있어요.
              </p>
              <div className="mt-4">
                <AutocompleteSwitch />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
