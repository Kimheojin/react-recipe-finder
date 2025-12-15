import * as Form from "@radix-ui/react-form";
import * as Popover from "@radix-ui/react-popover";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LuClock3,
  LuLoader,
  LuSearch,
  LuSparkles,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { container } from "tsyringe";
import AutocompleteRepository from "../../repository/autocomplete/AutocompleteRepository";
import { useSearchStore } from "../../stores/searchStore";

const RECENT_STORAGE_KEY = "recipe-recent-searches";

const searchTypeLabelMap: Record<string, string> = {
  recipename: "레시피명 기준",
  ingredient: "재료명 기준",
  cookingorderlist: "조리 순서 기준",
};

const autocompleteLabelMap: Record<string, string> = {
  recipename: "레시피명 추천 사용 중",
  ingredient: "재료명 추천 사용 중",
  none: "자동완성 꺼짐",
};

function highlightMatch(text: string, query: string): ReactNode {
  if (!query.trim()) {
    return text;
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  const segments: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    if (start > lastIndex) {
      segments.push(text.slice(lastIndex, start));
    }

    segments.push(
      <mark
        key={`${text}-${start}`}
        className="bg-transparent font-semibold text-[#2f5bda]"
      >
        {match[0]}
      </mark>
    );

    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments;
}

export default function SearchBox() {
  const AUTOCOMPLETE_REPO = container.resolve(AutocompleteRepository);
  const [currentInput, setCurrentInput] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [recentTerms, setRecentTerms] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [forceClosePopover, setForceClosePopover] = useState(false);
  const navigate = useNavigate();
  const settings = useSearchStore((state) => state.settings);
  const setSearchValue = useSearchStore((state) => state.setSearchValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        setRecentTerms(JSON.parse(stored));
      }
    } catch (error) {
      console.error("최근 검색어 로드 실패:", error);
    }
  }, []);

  const persistRecentTerm = useCallback((term: string) => {
    if (typeof window === "undefined") return;
    setRecentTerms((prev) => {
      const sanitized = term.trim();
      if (!sanitized) return prev;
      const next = [sanitized, ...prev.filter((item) => item !== sanitized)].slice(
        0,
        5
      );
      try {
        window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error("최근 검색어 저장 실패:", error);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
    if (
      currentInput.trim() === "" ||
      settings.autocompleteType === "none"
    ) {
      setAutocompleteResults([]);
      setIsFetching(false);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;
    setIsFetching(true);
    setErrorMessage(null);

    const timer = setTimeout(async () => {
      try {
        if (settings.autocompleteType === "recipename") {
          const result = await AUTOCOMPLETE_REPO.recipeNameAutocomoplete(
            currentInput
          );
          if (cancelled) return;
          const sorted = result.autocompleteRecipeNameDtoList
            .sort((a, b) => b.score - a.score)
            .map((item) => item.recipeName);
          setAutocompleteResults(sorted);
        } else if (settings.autocompleteType === "ingredient") {
          const result = await AUTOCOMPLETE_REPO.ingredientAutocomplete(
            currentInput
          );
          if (cancelled) return;
          const sorted = result.autocompleteDtoList
            .sort((a, b) => b.score - a.score)
            .map((item) => item.ingredient);
          setAutocompleteResults(sorted);
        }
      } catch (error) {
        console.error("자동완성 에러:", error);
        if (!cancelled) {
          setAutocompleteResults([]);
          setErrorMessage("추천어를 불러오는 중 문제가 발생했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsFetching(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [AUTOCOMPLETE_REPO, currentInput, settings.autocompleteType]);

  const handleSearch = useCallback(
    (valueToSearch?: string) => {
      const searchTerm = (valueToSearch ?? currentInput).trim();
      if (!searchTerm) return;
      setSearchValue(searchTerm);
      persistRecentTerm(searchTerm);
      navigate("/search-results");
      setAutocompleteResults([]);
      setIsFetching(false);
      setErrorMessage(null);
      setForceClosePopover(true);
    },
    [currentInput, navigate, persistRecentTerm, setSearchValue]
  );

  const handleValueChange = (value: string) => {
    setForceClosePopover(true);
    setCurrentInput(value);
    handleSearch(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      settings.autocompleteType !== "none" &&
      (autocompleteResults.length > 0 || isFetching)
    ) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev === autocompleteResults.length - 1 ? 0 : prev + 1
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev <= 0 ? autocompleteResults.length - 1 : prev - 1
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (activeIndex > -1) {
          handleValueChange(autocompleteResults[activeIndex]);
        } else {
          handleSearch();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        setAutocompleteResults([]);
        setIsFetching(false);
        setErrorMessage(null);
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const placeholderText = useMemo(() => {
    if (settings.autocompleteType === "recipename") {
      return "예: 스파게티, 라면, 김치볶음밥";
    }
    if (settings.autocompleteType === "ingredient") {
      return "예: 닭가슴살, 토마토";
    }
    return "찾고 싶은 레시피나 재료를 입력하세요";
  }, [settings.autocompleteType]);

  const instructionText =
    settings.autocompleteType === "none"
      ? "Enter 키로 즉시 검색할 수 있어요."
      : "↑↓ 키로 이동 · Enter 키로 선택하세요.";

  const currentSearchTypeLabel =
    searchTypeLabelMap[settings.searchType] ?? "검색 기준 선택 안 됨";

  const autocompleteModeLabel =
    autocompleteLabelMap[settings.autocompleteType] ?? "자동완성 설정";

  const shouldShowPopover =
    settings.autocompleteType !== "none" &&
    currentInput.length > 0 &&
    (isFetching || autocompleteResults.length > 0 || !!errorMessage) &&
    !forceClosePopover;

  const hasRecentTerms = recentTerms.length > 0;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="text-xs font-semibold text-[#5d636f]">
          자동 완성 종류 : {autocompleteModeLabel}
        </div>
        <Popover.Root open={shouldShowPopover}>
        <Popover.Trigger asChild>
          <Form.Root
            className="w-full"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <Form.Field name="search" className="w-full">
              <div className="relative w-full">
                <Form.Control asChild>
                  <input
                    className="h-12 w-full rounded-xl border border-[#d7dbe2] bg-white px-4 pr-24 text-base text-[#1f2329] shadow-sm placeholder:text-[#9aa0ac] focus:border-[#2f5bda] focus:outline-none focus:ring-2 focus:ring-[#d2defd]"
                    placeholder={placeholderText}
                    spellCheck={false}
                    value={currentInput}
                    onChange={(event) => {
                      setForceClosePopover(false);
                      setCurrentInput(event.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                </Form.Control>
                {currentInput && (
                  <button
                    type="button"
                    aria-label="검색어 지우기"
                    className="absolute right-16 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-[#8a909d] hover:bg-[#eef1f6]"
                    onClick={() => {
                      setCurrentInput("");
                      setAutocompleteResults([]);
                      setIsFetching(false);
                      setErrorMessage(null);
                      setForceClosePopover(false);
                    }}
                  >
                    <LuX />
                  </button>
                )}
                <Form.Submit asChild>
                  <button
                    type="submit"
                    aria-label="레시피 검색"
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg bg-[#2f5bda] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2549a6]"
                  >
                    <LuSearch />
                  </button>
                </Form.Submit>
              </div>
            </Form.Field>
          </Form.Root>
        </Popover.Trigger>

        <div className="flex flex-wrap items-center justify-between rounded-lg bg-[#f5f7fb] text-xs font-medium text-[#5d636f] shadow-sm">
          <span>통합 검색 조건 : {currentSearchTypeLabel}</span>
          <span>{instructionText}</span>
        </div>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={12}
            style={{ width: "var(--radix-popover-trigger-width)" }}
            className="z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#d7dbe2] bg-white p-2 shadow-lg"
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[#5d636f]">
              <span>추천 검색어</span>
              {isFetching && (
                <span className="flex items-center gap-1 text-[11px] font-normal text-[#8a909d]">
                  <LuLoader className="animate-spin text-sm" />
                  불러오는 중
                </span>
              )}
            </div>

            {!isFetching && autocompleteResults.length === 0 && !errorMessage && (
              <div className="px-3 py-4 text-xs text-[#8a909d]">
                아직 추천 검색어가 없습니다. 다른 키워드로 입력해 보세요.
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                <LuTriangleAlert className="text-base" />
                {errorMessage}
              </div>
            )}

            {autocompleteResults.map((item, index) => (
              <button
                type="button"
                key={item}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleValueChange(item)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  index === activeIndex
                    ? "bg-[#eff3ff] text-[#1f2329]"
                    : "text-[#1f2329] hover:bg-[#f5f6f8]"
                }`}
              >
                <span>{highlightMatch(item, currentInput)}</span>
                <LuSparkles className="text-base text-[#9aa0ac]" />
              </button>
            ))}

            {hasRecentTerms && (
              <div className="mt-3 border-t border-[#eef1f6] pt-3">
                <div className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-[#5d636f]">
                  <LuClock3 />
                  최근 검색어
                </div>
                <div className="mt-2 flex flex-wrap gap-2 px-2">
                  {recentTerms.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="rounded-full border border-[#d7dbe2] px-3 py-1 text-xs font-medium text-[#1f2329] transition hover:border-[#2f5bda]"
                      onClick={() => handleValueChange(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  </div>
  );
}
