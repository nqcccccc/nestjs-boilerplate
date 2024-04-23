import { DataSource, QueryRunner } from 'typeorm';

export async function getTransaction(
  dataSource: DataSource,
): Promise<QueryRunner> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  return queryRunner;
}
