import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from 'src/post/entity/post.entity';
import { Role } from 'src/role/entity/role.entity';
import { Learner } from 'src/learner/entity/learner.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 100,
  })
  firstName: string;

  @Column({
    length: 100,
  })
  lastName: string;

  @Column({
    length: 100,
  })
  middleName: string;

  @Column({
    length: 100,
    unique: true,
    nullable: true,
  })
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  status: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  active: boolean;

  @Column({ nullable: true })
  otpCreatedDate: Date;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  isConfirmedEmail: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Learner, (learner) => learner.user)
  learners: Learner[];

  @ManyToMany(() => Role, (roles) => roles.users)
  roles: Role[];
}
