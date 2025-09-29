export type AutocompleteType = "recipename" | "ingredient";
export type SearchType = "recipename" | "ingredient" | "cookingorderlist";

export interface SearchSettings {
    autocompleteType: AutocompleteType;
    autocomplete: boolean;
    searchType: SearchType;
}