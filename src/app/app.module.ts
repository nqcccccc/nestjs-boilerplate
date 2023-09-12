import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from '@common/common.module';
import { RouterModule } from 'src/router/router.module';

@Module({
  imports: [CommonModule, RouterModule.forRoot()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
