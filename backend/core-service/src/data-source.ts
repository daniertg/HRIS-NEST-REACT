import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Attendance } from './attendance/attendance.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'core_hris',
  entities: [User, Attendance],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
});
