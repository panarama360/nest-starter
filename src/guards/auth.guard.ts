import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getUser } from '../functions/get.user';

export class AuthGuard implements CanActivate{

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    return getUser(ctx).then(value => !!value);
  }

}