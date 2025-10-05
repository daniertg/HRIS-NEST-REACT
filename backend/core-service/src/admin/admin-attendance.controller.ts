import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

type SearchBody = {
  startDate?: string;   // YYYY-MM-DD
  endDate?: string;     // YYYY-MM-DD
  status?: 'IN'|'OUT';
  userId?: number;
  nameLike?: string;    // cari nama karyawan mengandung text
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/attendance')
export class AdminAttendanceController {
  constructor(
    @InjectRepository(Attendance) private atts: Repository<Attendance>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  @Post('search')
  async search(@Body() body: SearchBody) {
    // default awal bulan s/d hari ini
    const now = new Date();
    const first = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-01`;
    const today = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;

    const start = body.startDate || first;
    const end = body.endDate || today;

    const qb = this.atts.createQueryBuilder('a')
      .leftJoin(User, 'u', 'u.id = a.userId')
      .select([
        'a.id AS id',
        'a.userId AS userId',
        'u.name AS name',
        'u.email AS email',
        'a.date AS date',
        'a.time AS time',
        'a.status AS status',
      ])
      .where('a.date BETWEEN :start AND :end', { start, end });

    if (body.status) qb.andWhere('a.status = :status', { status: body.status });
    if (body.userId) qb.andWhere('a.userId = :uid', { uid: body.userId });
    if (body.nameLike) qb.andWhere('u.name LIKE :nm', { nm: `%${body.nameLike}%` });

    qb.orderBy('a.date', 'DESC').addOrderBy('a.time', 'DESC');
    const rows = await qb.getRawMany();

    return {
      range: { start, end },
      count: rows.length,
      data: rows,
    };
  }
}
