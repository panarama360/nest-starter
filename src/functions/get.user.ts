import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../modules/prisma/prisma.service';
import * as jwt from "jsonwebtoken";

export async function getUser<T = any>(gqlContext: GqlExecutionContext): Promise<T | false>{
  const context = gqlContext.getContext<{req: any, res: any, prisma: PrismaService}>();
  if(context.req.user) return context.req.user;
  const token = (context.req.headers['Authorization'] || context.req.headers['authorization'])?.split(' ')[1];
  if(token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      context.req.user = await context.prisma.user.findUnique({
        where: {
          id: decode.id
        }
      })
      return context.req.user;
    }catch (e){
      return false;
    }
  }
  return;
}