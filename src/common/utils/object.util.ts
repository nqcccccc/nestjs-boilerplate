import {
  ListPaginate,
  QueryPaginate,
} from '@common/database/types/database.type';

export function wrapPagination<T>(
  data: T[],
  totalCount: number,
  paginationCfg: QueryPaginate,
): ListPaginate<T> {
  return {
    data: data,
    total_pages: Math.ceil(totalCount / paginationCfg.limit),
    limit: paginationCfg.limit,
    page: paginationCfg.page,
    total_records: totalCount,
  };
}

export function parseJson(input: any) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

export const isEmpty = (value: unknown): boolean => {
  return (
    value == null || (typeof value === 'string' && value.trim().length === 0)
  );
};
