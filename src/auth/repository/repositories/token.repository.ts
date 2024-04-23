import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Token } from '../entities/token.entity';

@Injectable()
export class TokenRepository extends Repository<Token> {
  constructor(dataSource: DataSource) {
    super(Token, dataSource.createEntityManager());
  }
}
