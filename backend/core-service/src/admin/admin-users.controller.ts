import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/users')
export class AdminUsersController {
  constructor(@InjectRepository(User) private users: Repository<User>) {}

  @Get()
  async list() {
    return this.users.find({ select: ['id','name','email','phone','position','photo'] });
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne({ where: { id }, select: ['id','name','email','phone','position','photo'] });
  }

  @Post()
  async create(@Body() body: Partial<User> & { password: string }) {
    if (!body.email || !body.name || !body.password) {
      throw new BadRequestException('name, email, password wajib');
    }
    const hashed = await bcrypt.hash(body.password, 10);
    const user = this.users.create({ ...body, password: hashed });
    await this.users.save(user);
    return { message: 'User created', id: user.id };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<User> & { password?: string }) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User tidak ditemukan');

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    Object.assign(user, body);
    await this.users.save(user);
    return { message: 'User updated' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.users.delete(id);
    return { message: 'User deleted' };
  }
}
