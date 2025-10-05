import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  status: 'IN' | 'OUT';
}
