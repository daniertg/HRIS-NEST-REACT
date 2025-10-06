import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  async create(data: Partial<Attendance>) {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;

    // Cek apakah sudah ada record untuk hari ini
    const todayRecords = await this.attendanceRepo.find({
      where: { userId: data.userId, date: currentDate },
      order: { time: 'ASC' }, // urut dari paling awal ke paling akhir
    });

    // Ambil status terakhir hari ini (jika ada)
    const lastRecord = todayRecords.length ? todayRecords[todayRecords.length - 1] : null;

    if (data.status === 'IN') {
      // Boleh IN jika belum ada record, atau record terakhir adalah OUT
      if (lastRecord && lastRecord.status === 'IN') {
        throw new BadRequestException('You must clock out before clocking in again');
      }
    }

    if (data.status === 'OUT') {
      // Boleh OUT hanya jika record terakhir ada dan status terakhir adalah IN
      if (!lastRecord || lastRecord.status !== 'IN') {
        throw new BadRequestException('You need to clock in first');
      }
    }

    const attendance = this.attendanceRepo.create({
      userId: data.userId,
      status: data.status,
      date: currentDate,
      time: currentTime,
    });

    const result = await this.attendanceRepo.save(attendance);
    console.log('Saved attendance:', result);
    return result;
  }

  async getByUser(userId: number) {
    return await this.attendanceRepo.find({
      where: { userId },
      order: { date: 'DESC', time: 'DESC' },
    });
  }

  async getSummary(userId: number, startDate?: string, endDate?: string) {
    if (!startDate || !endDate) {
      const now = new Date();
      const firstDay = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-01`;
      const today = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

      startDate = startDate || firstDay;
      endDate = endDate || today;
    }

    return await this.attendanceRepo
      .createQueryBuilder('attendance')
      .where('attendance.userId = :userId', { userId })
      .andWhere('attendance.date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .orderBy('attendance.date', 'DESC')
      .getMany();
  }
}
