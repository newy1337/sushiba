import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (oldUser) throw new BadRequestException('User Already Exist');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        password: await hash(dto.password),
      },
    });

    const tokens = await this.generateToken(user.id);
    return { user, tokens };
  }


  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    const tokens = await this.generateToken(user.id)
    return {user,tokens}
  }

  async refreshToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid Refresh Token');
    console.log(result)
    const user = await this.prisma.user.findUnique({ where: { id: result.id } });
    console.log(user)

    const tokens = await this.generateToken(result.id);
    return { user, tokens };
  }

  private async generateToken(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, { expiresIn: '10h' });
    const refreshToken = this.jwt.sign(data, { expiresIn: '24h' });
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
        where: {
            email: dto.email
        }
    })
    if(!user) throw new NotFoundException('User not found')
    
    const isValid = await verify(user.password,dto.password)  
    if (!isValid)   throw new UnauthorizedException('User not found')
    
    return user     
  }
}
