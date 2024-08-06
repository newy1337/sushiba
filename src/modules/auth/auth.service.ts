import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CompleteAuthDto, sendOTPDto, verifyUserDto } from './dto/auth.dto';
import { Twilio } from 'twilio';

@Injectable()
export class AuthService {
  private readonly twilioClient: Twilio;
  private readonly verifySid: string;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    this.verifySid = process.env.TWILIO_VERIFY_SID;
  }

  async sendOTP(dto: sendOTPDto) {
    try {
      await this.twilioClient.verify.v2
        .services(this.verifySid)
        .verifications.create({ to: dto.phone, channel: 'sms' });
      return { message: 'Otp sent', dto };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to send OTP');
    }
  }

  async verifyUser(dto: verifyUserDto) {
    // const verificationCheck = await this.twilioClient.verify.v2
    //   .services(this.verifySid)
    //   .verificationChecks.create({ to: dto.phone, code: dto.otp });
    //
    // if (verificationCheck.status !== 'approved') {
    //   throw new UnauthorizedException('Invalid OTP');
    // }

    let user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    delete dto.otp;
    if (!user) {
      user = await this.prisma.user.create({
        data: dto,
      });
    }

    const tokens = await this.generateToken(user.id, user.role);
    return { user, tokens, needCompleteRegister: true };
  }

  async completeAuth(dto: CompleteAuthDto, userId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    return { message: 'User complete full auth successfully', user };
  }

  async refreshToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid Refresh Token');
    console.log(result);
    const user = await this.prisma.user.findUnique({
      where: { id: result.id },
    });
    console.log(user);

    const tokens = await this.generateToken(result.id, result.role);
    return { user, tokens };
  }

  private async generateToken(userId: string, role: string) {
    const data = { id: userId, role };
    const accessToken = this.jwt.sign(data, { expiresIn: '10h' });
    const refreshToken = this.jwt.sign(data, { expiresIn: '168h' });
    return { accessToken, refreshToken };
  }
}
