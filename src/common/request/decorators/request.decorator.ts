import { AuthUser } from '@auth/types/auth.type';
import {
  REQUEST_CUSTOM_TIMEOUT_META_KEY,
  REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
} from '@common/request/constants/request.constant';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const RequestTimeout = (seconds: number): MethodDecorator => {
  return applyDecorators(
    SetMetadata(REQUEST_CUSTOM_TIMEOUT_META_KEY, true),
    SetMetadata(REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY, seconds * 1000),
  );
};

export const ReqAuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user as AuthUser;
  },
);

export const TransId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.__id as string;
  },
);
