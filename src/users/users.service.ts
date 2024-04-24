import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleService } from 'src/role/role.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { roleId, ...rest } = createUserDto;

    const role = await this.roleService.findbyId(roleId);

    const user = this.userRepository.create({
      ...rest,
      role
    });

    return this.userRepository.save(user);
  }

  async findAll() {
    const users = await this.userRepository.find({
      relations: ['role']
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id
      },
      relations: ['role']
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return user;
  }

  async findOnebyEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new NotFoundException(`There is no user under email ${email}`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const role =
      updateUserDto.roleId &&
      (await this.roleService.findbyId(updateUserDto.roleId));

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      role
    });

    if (!user) {
      throw new NotFoundException(`There is no user under id ${id}`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    });

    return this.userRepository.remove(user);
  }
}
