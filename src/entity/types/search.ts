export type AutocompleteType = "recipename" | "ingredient" | "none";
export type SearchType = "recipename" | "ingredient" | "cookingorderlist";

export interface SearchSettings {
    autocompleteType: AutocompleteType;
    searchType: SearchType;
}