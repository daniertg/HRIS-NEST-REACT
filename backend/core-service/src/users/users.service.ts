import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getProfile(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'phone', 'position', 'photo'],
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
  }

  async updateProfile(
    id: number,
    data: Partial<{ phone: string; photo: string; password: string }>,
  ) {
    // 🔍 1. Cek apakah user ada
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // 🔄 2. Update hanya field yang dikirim
    if (data.phone !== undefined) {
      user.phone = data.phone;
    }
    if (data.photo !== undefined) {
      user.photo = data.photo;
    }
    if (data.password !== undefined) {
      user.password = data.password;
    }

    // 💾 3. Simpan ke database
    await this.userRepo.save(user);

    // ✅ 4. Return profil yang sudah di-update
    return {
      message: 'Profil berhasil diperbarui',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
      },
    };
  }
}
