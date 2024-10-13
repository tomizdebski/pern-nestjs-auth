import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
})
export class AppModule {}
