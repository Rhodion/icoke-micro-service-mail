import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_sap_logs' })
export class OrderSapLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

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
  sap_status: string;

  @Column()
  sap_message: string;

  @Column()
  sap_order: string;

  @Column()
  sap_fornecimento: string;

  @Column()
  sap_fatura: string;
}
