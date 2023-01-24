import { RefillDto } from './dto/refill.dto';

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class RecoverPassController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('icoke.email.refill')
  refill(@Payload() refillDto: RefillDto) {
    return this.mailService.refill(refillDto);
  }
}
