import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'audit_sap_logs' })
export class AuditSapLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  audit_id: number;

  @Column()
  status: number;

  @Column()
  message: string;

  @Column()
  data: string;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;
}
