import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Transformation {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    js: string

    @Column()
    event_id: string

}
