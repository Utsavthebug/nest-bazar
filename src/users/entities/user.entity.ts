import { Role } from 'src/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 25 })
  name: string;

  @Column({ length: 25 })
  surname: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @JoinTable()
  @ManyToOne(() => Role, (role: Role) => role.users)
  role: Role;
}
