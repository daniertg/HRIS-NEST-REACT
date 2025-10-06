import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

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
      name?: string;        // tambah
      position?: string;    // tambah
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

  // ✅ Upload foto profil (multipart/form-data, field: photo)
  @Post('upload-photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = join(process.cwd(), 'uploads', 'profiles');
          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `profile-${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(png|jpe?g|gif|webp)$/)) {
          return cb(new BadRequestException('Hanya file gambar yang diperbolehkan'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadPhoto(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File foto tidak ditemukan');
    }
    const userId = req.user.id;
    // pastikan path yang dikembalikan pakai prefix /uploads
    const photoPath = `/uploads/profiles/${file.filename}`;
    await this.usersService.updateProfile(userId, { photo: photoPath });
    return { message: 'Foto berhasil diupload', photo: photoPath };
  }
}
