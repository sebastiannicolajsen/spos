import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  AfterLoad,
} from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryColumn()
  id: string;

  @Column()
  javascript: string;

  events: string[];

  @Column()
  private events_: string;

  objects: string[];

  @Column()
  private objects_: string;

  @Column()
  code: string;

  @BeforeInsert()
  beforeInsert() {
    this.events_ = JSON.stringify(this.events);
    this.objects_ = JSON.stringify(this.objects);
  }

  @AfterLoad()
  afterLoad() {
    this.events = JSON.parse(this.events_);
    this.objects = JSON.parse(this.objects_);
  }
}
