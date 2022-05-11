import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (defaultValue: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (defaultValue) {
      return request.user[defaultValue];
    }
    return request.user;
  },
);
