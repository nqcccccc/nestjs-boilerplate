import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';

@Module({
  controllers: [HealthPublicController],
  providers: [],
  exports: [],
  imports: [TerminusModule],
})
export class RoutesPublicModule {}
