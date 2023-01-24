import { AuditDto } from './dto/audit.dto';

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class RecoverPassController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('icoke.email.audit')
  audit(@Payload() auditDto: AuditDto) {
    return this.mailService.audit(auditDto);
  }
}
