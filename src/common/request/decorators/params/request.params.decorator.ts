import { AuthUser } from '@auth/types/auth.type';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user as AuthUser;
  },
);

export const Id = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.__id as string;
  },
);
