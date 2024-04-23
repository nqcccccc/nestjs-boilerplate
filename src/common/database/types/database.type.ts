export type QueryPaginate = {
  limit?: number;
  page?: number;
  sorting?: string;
};

export type QueryPeriod = {
  date_from?: Date;
  date_to?: Date;
};

export type ListPaginate<T> = {
  total_records: number;
  limit: number;
  page: number;
  total_pages: number;
  data: T[];
};
