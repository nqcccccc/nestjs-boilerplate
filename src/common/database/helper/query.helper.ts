import {
  QueryPaginate,
  QueryPeriod,
} from '@common/database/types/database.type';
import dayjs from 'dayjs';
import { SelectQueryBuilder } from 'typeorm';

export function applyQueryPaging<T>(
  param: QueryPaginate,
  query: SelectQueryBuilder<T>,
  isRaw = false,
): void {
  if (param.limit && param.page) {
    if (!isRaw) {
      query.take(param.limit).skip(param.limit * (param.page - 1));
    } else {
      query.limit(param.limit).offset(param.limit * (param.page - 1));
    }
  }
}

export function extractSorting(value: string): {
  key: string;
  dir: 'ASC' | 'DESC';
} {
  const [sortKey, sortDir] = value.split(' ');

  return {
    key: sortKey,
    dir: sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
  };
}

export function applyQuerySorting<T>(
  value: string,
  query: SelectQueryBuilder<T>,
  alias?: string,
  isAddOrder = false,
): void {
  const sortingInfo = extractSorting(value);
  const { key: sortKey, dir: sortDir } = sortingInfo;
  if (isAddOrder) {
    query.addOrderBy(alias ? alias + '.' + sortKey : sortKey, sortDir);
  } else {
    query.orderBy(alias ? alias + '.' + sortKey : sortKey, sortDir);
  }
}

export function applyQueryMonthRange<T>(
  params: {
    date_from: Date;
    date_to?: Date;
  },
  query: SelectQueryBuilder<T>,
  config: { alias?: string; column: string },
): void {
  if (!params.date_to) {
    params.date_to = dayjs(params.date_from).endOf('month').toDate();
  }
  params.date_from = dayjs(params.date_from).startOf('month').toDate();
  applyQueryPeriod(params, query, config);
}

export function applyQueryPeriod<T>(
  params: QueryPeriod,
  query: SelectQueryBuilder<T>,
  config: { alias?: string; column: string },
): void {
  const from = params?.date_from;
  const to = params?.date_to;

  const alias = config.alias ? config.alias + '.' : '';

  if (from && to) {
    query.andWhere(`${alias}${config.column} BETWEEN :from AND :to`, {
      from,
      to,
    });
  } else if (from) {
    query.andWhere(`${alias}${config.column} >= :from`, { from });
  } else if (to) {
    query.andWhere(`${alias}${config.column} <= :to`, { to });
  }
}
