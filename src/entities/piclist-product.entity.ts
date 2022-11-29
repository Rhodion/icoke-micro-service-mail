import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'piclist_products' })
export class PiclistProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  piclist_id: number;

  @Column()
  product_id: number;

  @Column()
  qtd: number;
}
