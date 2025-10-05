import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private repo: Repository<Attendance>,
  ) {}

  create(data: Partial<Attendance>) {
    const attendance = this.repo.create(data);
    return this.repo.save(attendance);
  }

  getByUser(userId: number) {
    return this.repo.find({ where: { userId }, relations: ['user'] });
  }
}
