export interface AutoComplete {
  placeId?: string;
  mainText?: string;
  secondaryText?: string;
  mainTextMatchedSubstrings: AutoCompleteMatchedSubstrings;
}

export interface AutoCompleteMatchedSubstrings {
  offset: number;
  length: number;
}
