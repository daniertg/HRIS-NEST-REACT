import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new BadRequestException('Email sudah terdaftar');

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ name, email, password: hashed });
    await this.userRepo.save(user);

    return { message: 'Registrasi berhasil', id: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'phone', 'position', 'photo', 'role'],
    });

    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password salah');

    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwt.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        position: user.position,
        photo: user.photo,
        role: user.role,
      },
    };
  }
}
