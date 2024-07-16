import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessControlService } from './access-control.service';

@Global()
@Module({
  providers: [JwtService, AccessControlService],
  exports: [JwtService, AccessControlService],
})
export class SharedModule {}
