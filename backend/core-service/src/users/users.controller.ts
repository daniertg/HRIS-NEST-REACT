import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import * as bcrypt from 'bcrypt';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Ambil profil user yang login
  @Get('me')
  async getProfile(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getProfile(userId);
  }

  // ✅ Update profil user
  @Patch('update')
  async updateProfile(
    @Req() req,
    @Body()
    body: {
      phone?: string;
      photo?: string;
      password?: string;
    },
  ) {
    const userId = req.user.id;

    // ✅ Tambahkan validasi kalau body kosong
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('Request body tidak boleh kosong');
    }

    // ✅ Kalau ada password, hash dulu
    if (body.password) {
      if (body.password.length < 6) {
        throw new BadRequestException('Password minimal 6 karakter');
      }
      body.password = await bcrypt.hash(body.password, 10);
    }

    return this.usersService.updateProfile(userId, body);
  }
}
