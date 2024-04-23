import { MailService } from '@common/mail/services/mail.service';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('mail:sender', {
  concurrency: 10,
  limiter: {
    max: 2,
    duration: 60000,
  },
})
export class SendMailProcessor extends WorkerHost {
  constructor(
    private readonly logger: Logger,
    private readonly mailService: MailService,
  ) {
    super();
  }
  @OnWorkerEvent('active')
  onQueueActive(job: Job) {
    this.logger.log(
      `Job has been started: ${job.id}`,
      'SendMailProcessor.onQueueActive',
    );
  }

  @OnWorkerEvent('completed')
  onQueueComplete(job: Job) {
    this.logger.log(
      `Job has been finished: ${job.id}`,
      'SendMailProcessor.onQueueComplete',
    );
  }

  @OnWorkerEvent('failed')
  onQueueFailed(job: Job, err: any) {
    this.logger.error(
      `Job has been failed: ${job.id} with data ${JSON.stringify(job.data)}`,
      err,
      'SendMailProcessor.onQueueFailed',
    );
  }

  @OnWorkerEvent('error')
  onQueueError(e: any) {
    this.logger.error(
      `Job has got error `,
      e,
      'SendMailProcessor.onQueueError',
    );
  }

  @OnWorkerEvent('stalled')
  onQueueStalled(job: Job) {
    this.logger.log(
      `Job has been stalled: ${job.id}`,
      'SendMailProcessor.onQueueStalled',
    );
  }

  async process(job: Job<any, any, string>): Promise<void> {
    await this.mailService.sendNoReply(job.data);
  }
}
