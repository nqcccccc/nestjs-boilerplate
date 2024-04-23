import { SendMailProcessor } from '@common/mail/queues/send-mail.processor';
import { MailService } from '@common/mail/services/mail.service';
import { SystemRepositoryModule } from '@modules/system/repository/system.repository.module';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail:sender',
    }),
    SystemRepositoryModule,
  ],
  exports: [MailService],
  providers: [SendMailProcessor, MailService],
})
export class MailModule {}
