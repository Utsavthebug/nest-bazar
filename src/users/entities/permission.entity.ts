import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 25 })
  name: string;

  @Column({ length: 100 })
  description: string;

  @ManyToMany(() => Role, (role: Role) => role.permissions)
  roles: Role[];
}
