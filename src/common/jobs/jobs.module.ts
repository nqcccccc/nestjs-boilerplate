import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({})
export class JobsModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type
      | Promise<DynamicModule>
      | ForwardReference
    )[] = [];

    if (process.env.JOB_ENABLE === 'true') {
      imports.push(ScheduleModule.forRoot());
    }

    return {
      module: JobsModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
