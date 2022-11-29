import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'm_users' })
export class MUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  email_verified: boolean;

  @Column()
  email_token_verification: string;

  @Column()
  cpf: string;

  @Column()
  cpf_verified: boolean;

  @Column()
  birthday: string;

  @Column()
  cel: string;

  @Column()
  password_hash: string;

  @Column()
  optin_news: boolean;
}
