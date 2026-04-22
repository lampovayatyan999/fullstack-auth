import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { type Request } from 'express'; // <-- Убедитесь, что эта строка есть
import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationDto } from './dto/confirmation.dto';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async newVerfication(
    @Req() req: Request, 
    @Body() dto: ConfirmationDto
  ) {
    return this.emailConfirmationService.newVerification(req, dto);
  }
}