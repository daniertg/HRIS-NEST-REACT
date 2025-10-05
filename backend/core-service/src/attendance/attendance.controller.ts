import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req, BadRequestException, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard) 
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async create(@Req() req, @Body() data: Partial<Attendance>) {
    const userId = req.user.id;

    if (!data.status) {
      throw new BadRequestException('status wajib diisi');
    }

    return this.attendanceService.create({
      ...data,
      userId, 
    });
  }

  @Get(':userId')
  async getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.attendanceService.getByUser(userId);
  }
  @Post('summary')
  async getSummary(
    @Req() req,
    @Body() body: { startDate?: string; endDate?: string },
  ) {
    const userId = req.user.id; 
    return this.attendanceService.getSummary(userId, body.startDate, body.endDate);
  }
}

