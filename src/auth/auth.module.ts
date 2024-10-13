import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
