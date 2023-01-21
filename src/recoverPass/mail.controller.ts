import { RecoverPasswordDto } from './dto/recover-password.dto';
import { SignupValidationEmailDto } from './dto/signup-validation-email.dto';

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class RecoverPassController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('icoke.mobile.recover_password')
  recover_password(@Payload() recoverPasswordDto: RecoverPasswordDto) {
    return this.mailService.recover_password(recoverPasswordDto);
  }
}
