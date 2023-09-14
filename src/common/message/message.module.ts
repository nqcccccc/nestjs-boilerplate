import { Global, Module, Scope } from '@nestjs/common';
import * as path from 'path';
import { I18nModule, HeaderResolver, I18nJsonLoader } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [],
  exports: [],
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('app.defaultLanguage'),
        loaderOptions: {
          path: path.join(__dirname, '../../languages'),
          watch: true,
        },
      }),
      loader: I18nJsonLoader,
      inject: [ConfigService],
      resolvers: [new HeaderResolver(['locale'])],
    }),
  ],
  controllers: [],
})
export class MessageModule {}
