import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from './entities/token.entity';
import { TokenRepository } from './repositories/token.repository';

@Module({
  providers: [TokenRepository],
  exports: [TokenRepository],
  imports: [TypeOrmModule.forFeature([Token])],
})
export class TokenRepositoryModule {}
