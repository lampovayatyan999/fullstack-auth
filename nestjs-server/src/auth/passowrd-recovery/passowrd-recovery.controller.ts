import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { PassowrdRecoveryService } from './passowrd-recovery.service';
import { ResetPasswordDto } from './dto/new-password.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { NewPasswordDto } from './dto/reset-password.dto';

@Controller('auth/passowrd-recovery')
export class PassowrdRecoveryController {
  constructor(private readonly passowrdRecoveryService: PassowrdRecoveryService) {}

  @Recaptcha()
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passowrdRecoveryService.resetPassword(dto)
  }

  @Recaptcha()
  @Post('new/:token')
  @HttpCode(HttpStatus.OK)
  public async newPassword(@Body() dto: NewPasswordDto, @Param('token') token: string) {
    return this.passowrdRecoveryService.newPassword(dto, token)
  }
}
