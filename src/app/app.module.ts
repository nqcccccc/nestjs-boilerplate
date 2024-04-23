import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';

import { RouterModule } from '../router/router.module';

@Module({
  imports: [CommonModule, RouterModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
