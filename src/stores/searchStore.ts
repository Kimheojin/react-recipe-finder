import { create } from "zustand";
import type { SearchSettings } from "../entity/types/search";

interface SearchStore {
    searchValue: string;
    settings: SearchSettings; // 타고 들어가는 구조로 정의
    setSearchValue: (value: string) => void;
    setSettings: (settings: SearchSettings) => void;
    updateSetting: <K extends keyof SearchSettings>(
        key: K,
        value: SearchSettings[K]
    ) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
    searchValue: "",
    settings: {
        autocompleteType: "recipename",
        autocomplete: true,
        searchType: "recipename",
    },
    setSearchValue: (value) => set({ searchValue: value }),
    setSettings: (settings) => set({ settings }),
    updateSetting: (key, value) =>
        set((state) => ({
            settings: { ...state.settings, [key]: value },
        })),
}));
