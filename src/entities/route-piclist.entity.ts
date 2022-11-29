import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: '_v_get_route_piclists' })
export class RoutePiclist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: string;
}
