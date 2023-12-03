import { Expose } from 'class-transformer';
import { Contest } from 'src/contest/entity/contest.entity';
import { User } from 'src/user/entity/user.entity';
import { Vote } from 'src/vote/entity/vote.entity';
import { Winner } from 'src/winner/entity/winner.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CustomerDrawing {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  title: string;

  @Column()
  @Expose()
  description: string;

  @Column({ nullable: true })
  @Expose()
  imageUrl: string;

  @Column()
  @Expose()
  insertedDate: Date;

  @Column()
  @Expose()
  approved: boolean;

  @Column()
  @Expose()
  active: boolean;

  @ManyToOne(() => User, (user) => user.customerDrawings)
  @JoinColumn({ name: 'userId' })
  @Expose()
  user: User;

  @ManyToOne(() => Contest, (contest) => contest.customerDrawings)
  @JoinColumn({ name: 'contestId' })
  @Expose()
  contest: Contest;

  @OneToMany(() => Vote, (vote) => vote.customerDrawing)
  @Expose()
  votes: Vote[];

  @OneToMany(() => Winner, (winner) => winner.customerDrawing)
  @Expose()
  winners: Winner[];
}
