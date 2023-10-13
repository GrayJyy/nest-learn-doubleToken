import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;
  @Column({ length: 50 })
  username: string;
  @Column({ length: 18 })
  password: string;
}
