import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AccessControlModule } from 'nest-access-control';
import { RedisModule } from 'nestjs-redis';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { roles } from './modules/role/roles';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRootAsync({
      inject: [PrismaService],
      useFactory: (prisma: PrismaService) => ({
        autoSchemaFile: true,
        debug: process.env.NODE_ENV == 'development',
        playground: process.env.NODE_ENV == 'development',
        context: ({ req, res }) => ({ req, res, prisma }),
      }),
    }),
    RedisModule.register({
      url: process.env.REDIS,
    }),
    AccessControlModule.forRoles(roles),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
