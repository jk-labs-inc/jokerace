export type PaginationOptions = {
  currentPage?: number;
  itemsPerPage?: number;
};

export type SortingOptions = {
  orderBy?: string;
  ascending?: boolean;
};

export type SearchOptions = {
  searchColumn?: string;
  searchString?: string;
  pagination?: PaginationOptions;
  sorting?: SortingOptions;
  table?: string;
  language?: string;
};
