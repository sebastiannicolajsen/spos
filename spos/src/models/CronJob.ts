import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CronJob {
  @PrimaryColumn()
  id: string;

  @Column()
  event: string;

  @Column()
  interval: string;
}
