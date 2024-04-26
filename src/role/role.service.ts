import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  async findbyId(id: string) {
    const role = this.roleRepository.findOne({
      where: {
        id
      }
    });

    return role;
  }

  async checkPermission(id: string, neededPermission: string) {
    const role = await this.roleRepository.findOne({
      where: {
        id
      },
      relations: ['permissions']
    });

    const has_permission = role.permissions.find(
      (permission) => permission.name === neededPermission
    );

    if (has_permission) {
      return true;
    } else {
      return false;
    }
  }
}
