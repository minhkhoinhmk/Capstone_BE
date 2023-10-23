import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateLearnerRequest } from './dto/request/create-learner.dto';
import { RoleRepository } from 'src/role/role.repository';
import { NameRole } from 'src/role/enum/name-role.enum';
import { LearnerRepository } from './learner.repository';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/user.repository';
import { FilterLearnerByUserResponse } from './dto/response/filter-by-user.dto';

@Injectable()
export class LearnerService {
  private logger = new Logger('LearnerService', { timestamp: true });

  constructor(
    private learnerRepository: LearnerRepository,
    private roleRepository: RoleRepository,
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async createLearner(
    createLearnerRequest: CreateLearnerRequest,
    id: string,
  ): Promise<void> {
    if (
      (await this.userRepository.getUserByUserName(
        createLearnerRequest.userName,
      )) ||
      (await this.learnerRepository.getLearnerByUserName(
        createLearnerRequest.userName,
      ))
    ) {
      this.logger.error(
        `method=createLearner, userName=${createLearnerRequest.userName} was existed`,
      );
      throw new ConflictException('User name already exists');
    } else {
      const customer = await this.userRepository.getUserById(id);

      const role = await this.roleRepository.getRoleByName(NameRole.Learner);

      const learner = await this.learnerRepository.cretaeLearner(
        createLearnerRequest,
        customer,
        role,
      );

      this.logger.log(`method=createLearner, create learner successfully!`);

      if (
        (await this.learnerRepository.countLearnerOfEachCustomer(customer)) > 1
      ) {
        this.logger.error(`method=createLearner, learner accounts are full`);
        throw new BadRequestException(`Learner accounts are full`);
      } else {
        await this.learnerRepository.saveLearner(learner);
      }
    }
  }

  async getLearnerByUserId(
    userId: string,
  ): Promise<FilterLearnerByUserResponse[]> {
    const learners = await this.learnerRepository.getLearnerByUserId(userId);
    let responses: FilterLearnerByUserResponse[] = [];

    for (const learner of learners) {
      responses.push({
        id: learner.id,
        firstName: learner.firstName,
        middleName: learner.middleName,
        lastName: learner.lastName,
        active: learner.active,
        userName: learner.userName,
      });

      this.logger.log(
        `method=getLearnerByUserId, userId=${userId}, length=${responses.length}`,
      );

      return responses;
    }
  }
}
