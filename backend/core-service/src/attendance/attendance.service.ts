import { Injectable } from '@nestjs/common';
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

  const attendance = this.attendanceRepo.create({
    userId: data.userId, 
    status: data.status,
    date: currentDate,
    time: currentTime,
  });

  return await this.attendanceRepo.save(attendance);
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
