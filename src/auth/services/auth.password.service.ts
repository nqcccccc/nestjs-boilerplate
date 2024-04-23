import { VERIFY_EMAIL_REGEX } from '@app/constant/app.constant';
import { EStatus } from '@app/constant/app.enum';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { MessageService } from '@common/message/services/message.service';
import { comparePassword } from '@common/utils/string.util';
import { User } from '@modules/user/repository/entities/user.entity';
import { UserRepository } from '@modules/user/repository/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthPasswordService {
  private readonly authMessage: MessageService;

  constructor(
    private readonly userRepository: UserRepository,
    i18nService: I18nService,
  ) {
    this.authMessage = new MessageService(i18nService, 'auth');
  }

  async passwordAuthenticate(
    username: string,
    password: string,
  ): Promise<User> {
    const emailReg = new RegExp(VERIFY_EMAIL_REGEX);
    const user = await this.userRepository.getUserByCredential(
      username,
      emailReg.test(username) ? 'email' : 'username',
      true,
    );

    if (!user || user.deleted_at) {
      throw new CustomError(
        401,
        'UNAUTHORIZED',
        this.authMessage.getMessage('UNAUTHORIZED'),
      );
    }

    await this._checkPassword(user, password);
    await this._checkAccountStatus(user);

    return user;
  }

  private async _checkAccountStatus(user: User): Promise<void> {
    if (user.status === EStatus.inactive) {
      throw new CustomError(
        401,
        'ACCOUNT_INACTIVE',
        this.authMessage.getMessage('ACCOUNT_INACTIVE'),
      );
    }
  }

  private async _checkPassword(user: User, password: string): Promise<void> {
    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new CustomError(
        401,
        'UNAUTHORIZED',
        this.authMessage.getMessage('UNAUTHORIZED'),
      );
    }
  }
}
