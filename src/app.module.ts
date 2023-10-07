import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './character/entity/character.entity';
import { CharacterModule } from './character/character.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';
import { Post } from './post/entity/post.entity';
import { Role } from './role/entity/role.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { LearnerModule } from './learner/learner.module';
import { Learner } from './learner/entity/learner.entity';
import { JwtStore } from './user/entity/jwt-store.entity';
import { CategoryModule } from './category/category.module';
import { LevelModule } from './level/level.module';
import { ComboModule } from './combo/combo.module';
import { CourseModule } from './course/course.module';
import { PromotionModule } from './promotion/promotion.module';
import { PromotionCourseModule } from './promotion-course/promotion-course.module';
import { CourseFeedbackModule } from './course-feedback/course-feedback.module';
import { ChapterLectureModule } from './chapter-lecture/chapter-lecture.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProductions = configService.get('STAGE') === 'prod';
        return {
          ssl: isProductions,
          extra: {
            ssl: isProductions ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
          entities: [Character, User, Post, Role, Learner, JwtStore],
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    CharacterModule,
    AuthModule,
    UserModule,
    RoleModule,
    PostModule,
    LearnerModule,
    CategoryModule,
    LevelModule,
    ComboModule,
    CourseModule,
    PromotionModule,
    PromotionCourseModule,
    CourseFeedbackModule,
    ChapterLectureModule,
  ],
})
export class AppModule {}
