import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() data: Partial<Attendance>) {
    return this.attendanceService.create(data);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: number) {
    return this.attendanceService.getByUser(userId);
  }
}
