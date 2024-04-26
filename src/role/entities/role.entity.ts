import { Permissions } from 'src/users/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 25 })
  name: string;

  @OneToMany(() => User, (user: User) => user.role)
  users: User[];

  @JoinTable()
  @ManyToMany(() => Permissions, (permission: Permissions) => permission.roles)
  permissions: Permissions[];
}
