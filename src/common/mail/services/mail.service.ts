import { EStatus } from '@app/constant/app.enum';
import { BlankTemplate } from '@common/mail/templates/bank-template';
import { MailConfig, MailOptions } from '@common/mail/types/mail';
import { SystemRepository } from '@modules/system/repository/repositories/system.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import NodeMailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private mailConfig: MailConfig;

  constructor(
    private readonly logger: Logger,
    private readonly systemRepository: SystemRepository,
    @InjectQueue('mail:sender')
    private readonly mailQueue: Queue,
  ) {}

  sendBlankTemplate(parameter: BlankTemplate): void {
    const options: MailOptions = {
      subject: parameter.subject,
      mailTo: parameter.email,
      content: parameter.content,
    };
    this._sendMail(options).then();
  }

  async sendNoReply(data: MailOptions): Promise<void> {
    try {
      const transporter = await this._getTransporter();
      const from = `"${this.mailConfig?.email_name}" <${this.mailConfig?.sender_email}>`;
      const { subject, mailTo, content, attachments, cc } = data;

      await transporter.sendMail({
        from,
        to: mailTo.join(),
        subject,
        html: content,
        attachments,
        cc,
      });
    } catch (e) {
      this.logger.error(
        'Error when send no-reply mail ',
        e,
        'MailService.sendNoReply',
      );
    }
  }

  private async _sendMail(input: MailOptions): Promise<void> {
    for (const email of input.mailTo) {
      await this.mailQueue.add(
        'send-mail',
        {
          subject: input.subject,
          mailTo: [email],
          content: input.content,
          attachments: input.attachments || [],
          cc: input.cc || [],
        },
        {
          removeOnComplete: true,
          attempts: 5,
        },
      );
    }
  }

  private async _getMailConfig(): Promise<MailConfig> {
    const mailCfgRaw = await this.systemRepository.findBy({
      group: 'EMAIL_SMTP',
      status: EStatus.active,
    });

    if (!mailCfgRaw) {
      return null;
    }
    const mailCfg = {};
    for (const item of mailCfgRaw) {
      mailCfg[item.key.toLowerCase()] = item.value[0];
    }
    this.mailConfig = mailCfg;

    return mailCfg as MailConfig;
  }

  private async _getTransporter(): Promise<Transporter> {
    const mailConfig = await this._getMailConfig();
    if (!mailConfig) {
      return null;
    }
    return NodeMailer.createTransport({
      port: +mailConfig.port,
      host: mailConfig.host,
      auth: {
        user: mailConfig.username,
        pass: mailConfig.password,
      },
    });
  }
}
