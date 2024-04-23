import CustomError from '@common/error/exceptions/custom-error.exception';
import { MessageService } from '@common/message/services/message.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';

import { PermissionRepository } from '../repository/repositories/permission.repository';
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly authMessage: MessageService;
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionRepository: PermissionRepository,
    i18nService: I18nService,
  ) {
    this.authMessage = new MessageService(i18nService, 'auth');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFor: string[] = this.reflector.getAllAndOverride<string[]>(
      'PERMISSIONS',
      [context.getHandler(), context.getClass()],
    );

    if (requiredFor?.length) {
      const { user } = context.switchToHttp().getRequest();

      const permissions = await this.permissionRepository.getAllSlugByUserId(
        user?.id,
      );

      const hasFor = permissions.some((p) => requiredFor.includes(p.slug));

      if (!hasFor) {
        throw new CustomError(
          403,
          'FORBIDDEN',
          this.authMessage.getMessage('FORBIDDEN'),
        );
      }
    }

    return true;
  }
}
