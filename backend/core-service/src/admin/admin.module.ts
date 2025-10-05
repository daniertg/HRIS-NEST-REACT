import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Attendance } from '../attendance/attendance.entity';
import { AdminUsersController } from './admin-users.controller';
import { AdminAttendanceController } from './admin-attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Attendance])],
  controllers: [AdminUsersController, AdminAttendanceController],
})
export class AdminModule {}
