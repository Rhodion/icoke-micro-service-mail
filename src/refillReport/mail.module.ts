import { MUser } from '../entities/m-user.entity';
import { SendgridService } from '../providers/sendgrid/sendgrid.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecoverPassController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([MUser])],
  controllers: [RecoverPassController],
  providers: [MailService, SendgridService],
})
export class RefillReportModule {}
