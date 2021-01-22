import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ACGuard } from 'nest-access-control';

@Injectable()
export class AcGuard extends ACGuard {
  async getUser(context: ExecutionContext): Promise<any>{
    return GqlExecutionContext.create(context).getContext()?.req?.user
  }
}
