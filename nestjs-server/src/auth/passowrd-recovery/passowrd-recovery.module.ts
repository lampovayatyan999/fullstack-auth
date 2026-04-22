import { Module } from '@nestjs/common';
import { PassowrdRecoveryService } from './passowrd-recovery.service';
import { PassowrdRecoveryController } from './passowrd-recovery.controller';
import { UserService } from '@/user/user.service';
import { MailService } from '@/libs/mail/mail.service';

@Module({
  controllers: [PassowrdRecoveryController],
  providers: [PassowrdRecoveryService, UserService, MailService],
})
export class PassowrdRecoveryModule {}
