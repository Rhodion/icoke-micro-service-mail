import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product_return_sap_logs' })
export class ProductReturnSapLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_return_id: number;

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
