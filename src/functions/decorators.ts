import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getUser } from './get.user';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return getUser(GqlExecutionContext.create(ctx))
})