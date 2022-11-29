import { RecoverPasswordDto } from './dto/recover-password.dto';
import { SignupValidationEmailDto } from './dto/signup-validation-email.dto';

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('icoke.mobile.validate_email')
  signup_validation_email(
    @Payload() signupValidationEmailDto: SignupValidationEmailDto,
  ) {
    return this.mailService.signup_validation_email(signupValidationEmailDto);
  }

  @MessagePattern('icoke.mobile.recover_password')
  recover_password(@Payload() recoverPasswordDto: RecoverPasswordDto) {
    return this.mailService.recover_password(recoverPasswordDto);
  }
}
