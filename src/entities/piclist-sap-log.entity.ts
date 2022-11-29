import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'piclist_sap_logs' })
export class PiclistSapLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  piclist_id: number;

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

  @Column()
  automation_step: number;

  @Column()
  job: string;
}
