import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 📦 Import semua modul kamu
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    // ✅ 1. Baca file .env dari folder saat ini
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // baca langsung dari core-service/.env
    }),

    // ✅ 2. Koneksi ke database MySQL
    TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
  autoLoadEntities: true,
  synchronize: true,
  timezone: '+07:00',
  logging: true,
}),

    // ✅ 3. Import module lainnya
    AuthModule,
    UsersModule,
    AttendanceModule,
  ],
})
export class AppModule {}
