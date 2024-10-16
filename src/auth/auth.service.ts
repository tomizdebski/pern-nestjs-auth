import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(dto: AuthDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
         email, 
         hashedPassword, 
        },
    });

    return { message: 'signup was sucessful', user: { email } };
  }

  async signin(dto: AuthDto, req: Request, res: Response) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await this.comparePassword({
      password,
      hashedPassword: foundUser.hashedPassword,
    });

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    const token = await this.signToken({id: foundUser.id, email: foundUser.email});

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token);


    return res.send({message: 'Logged in succesfully' });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async comparePassword(args: { password: string; hashedPassword: string }) {
    const { password, hashedPassword } = args;
    return bcrypt.compare(password, hashedPassword);
  }

  async signToken(args: {id: string, email: string}) {
    const payload = args;
    return this.jwt.signAsync(payload, {secret: jwtSecret});
  }
    
}
