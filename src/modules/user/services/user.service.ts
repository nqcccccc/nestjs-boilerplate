import { EStatus } from '@app/constant/app.enum';
import { TokenRepository } from '@auth/repository/repositories/token.repository';
import { AuthUser } from '@auth/types/auth.type';
import { ListPaginate } from '@common/database/types/database.type';
import CustomError from '@common/error/exceptions/custom-error.exception';
import { MessageService } from '@common/message/services/message.service';
import { wrapPagination } from '@common/utils/object.util';
import { comparePassword, hashPassword } from '@common/utils/string.util';
import { RoleRepository } from '@modules/role/repository/repositories/role.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { In } from 'typeorm';

import { CreateUserDto } from '../dtos/create-user.dto';
import { FilterUserDto } from '../dtos/filter-user.dto';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
} from '../dtos/update-user.dto';
import { User } from '../repository/entities/user.entity';
import { UserRepository } from '../repository/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly userMessage: MessageService;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    i18nService: I18nService,
  ) {
    this.userMessage = new MessageService(i18nService, 'user');
  }

  async getList(params: FilterUserDto): Promise<ListPaginate<User>> {
    const [data, count] = await this.userRepository.getList(params);

    return wrapPagination<User>(data, count, params);
  }

  async create(input: CreateUserDto): Promise<void> {
    await this._checkDuplicateInfo(input);
    const password = await hashPassword(
      this.configService.get<string>('auth.defaultPassword'),
    );

    const roles = await this.roleRepository.find({
      where: { id: In(input.role_ids) },
    });

    if (roles.length !== input.role_ids.length) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.userMessage.getMessage('NOT_FOUND'),
      );
    }

    if (!input.role_ids.length) {
      const role = await this.roleRepository.findOne({
        where: { slug: 'user_standard' },
      });
      roles.push(role);
    }

    const user = new User();

    Object.assign(user, {
      ...input,
      password,
      user_roles: roles.map((r) => ({
        role: r,
      })),
    });

    await this.userRepository.save(user);
  }

  async update(input: UpdateUserDto): Promise<void> {
    const user = await this._checkDuplicateInfo(input, input?.id);

    if (!user) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.userMessage.getMessage('NOT_FOUND'),
      );
    }

    const roles = await this.roleRepository.find({
      where: {
        id: In(input.role_ids),
      },
    });

    if (
      roles.findIndex((v) => v.slug === 'admin') > -1 &&
      input.status === EStatus.inactive
    ) {
      throw new CustomError(
        400,
        'NOT_ALLOW',
        this.userMessage.getMessage('NOT_ALLOW'),
      );
    }

    Object.assign(user, {
      ...input,
      user_roles: roles.map((role) => ({ role: role })),
    });

    await this.userRepository.save(user);
  }

  async toggleStatus(id: string): Promise<void> {
    const user = await this.userRepository.getUserWithProfile(id, 'id');

    if (!user) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.userMessage.getMessage('NOT_FOUND'),
      );
    }
    if (user.user_roles.findIndex((v) => v.role.slug === 'admin') > -1) {
      throw new CustomError(
        400,
        'NOT_ALLOW',
        this.userMessage.getMessage('NOT_ALLOW'),
      );
    }
    const status = user.status === EStatus.active ? 0 : 1;
    await this.userRepository.update({ id }, { status });
  }

  async delete(id: string): Promise<void> {
    const user = await this.getById(id);
    if (user.user_roles.some((ur) => ur.role.slug === 'admin')) {
      throw new CustomError(
        400,
        'NOT_ALLOW',
        this.userMessage.getMessage('NOT_ALLOW'),
      );
    }
    await this.userRepository.softDelete(user.id);
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['user_roles', 'user_roles.role', 'profile'],
    });

    if (!user) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.userMessage.getMessage('NOT_FOUND'),
      );
    }

    return user;
  }

  async myProfile(loggedUser: AuthUser): Promise<User> {
    return this.userRepository.getUserWithProfile(loggedUser.id, 'id');
  }

  async changePassword(
    input: ChangePasswordDto,
    loggedUser: AuthUser,
  ): Promise<void> {
    const existedUser = await this.userRepository.findOne({
      where: { id: loggedUser.id },
      select: ['id', 'password'],
    });
    if (input.new_password === input.current_password) {
      throw new CustomError(
        400,
        'NEW_PASS_SAME_CUR_PASS',
        this.userMessage.getMessage('NEW_PASS_SAME_CUR_PASS'),
      );
    }
    if (!existedUser) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.userMessage.getMessage('NOT_FOUND'),
      );
    }
    const checkCurrentPassword = await comparePassword(
      input.current_password,
      existedUser.password,
    );
    if (!checkCurrentPassword) {
      throw new CustomError(
        400,
        'PASS_NOT_MATCH',
        this.userMessage.getMessage('PASS_NOT_MATCH'),
      );
    }

    const password = await hashPassword(input.new_password);

    await this.userRepository.update({ id: existedUser.id }, { password });
    await this.tokenRepository.delete({ user_id: loggedUser.id });
  }

  async resetPassword(input: ResetPasswordDto): Promise<void> {
    const existedUser = await this.userRepository.findOne({
      where: {
        id: input.id,
      },
    });
    if (!existedUser) {
      throw new CustomError(
        404,
        'NOT_FOUND',
        this.userMessage.getMessage('NOT_FOUND'),
      );
    }

    const password = await hashPassword(
      this.configService.get<string>('auth.defaultPassword'),
    );

    await this.userRepository.update({ id: existedUser.id }, { password });
    await this.tokenRepository.delete({ user_id: input.id });
  }

  private async _checkDuplicateInfo(
    input: CreateUserDto | UpdateUserDto,
    id?: string,
  ): Promise<User | void> {
    const { email, username } = input;
    const users = await this.userRepository.find({
      where: [{ username }],
    });

    const user = users.find((u) => u.id === id);
    if (user) {
      return user;
    }

    const duplicateUsername = users.find(
      (u) =>
        u.username.toLowerCase() === username?.toLowerCase() &&
        (id ? u.id !== id : true),
    );
    if (duplicateUsername) {
      throw new CustomError(
        400,
        'USERNAME_IN_USED',
        this.userMessage.getMessage('USERNAME_IN_USED'),
      );
    }

    const duplicateEmail = users.find(
      (user) => user.email === email && (id ? user.id !== id : true),
    );

    if (duplicateEmail) {
      throw new CustomError(
        400,
        'EMAIL_IN_USED',
        this.userMessage.getMessage('EMAIL_IN_USED'),
      );
    }
  }
}
