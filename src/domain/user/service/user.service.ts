import { UserRepository } from "../repository/user.repository";
import {
  CreateUserDTO,
  FindAllUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from "../dto/user.dto";
import { Prisma } from "../../../infrastructures/database/generated/prisma";
import {UserAlreadyExistsException, UserNotFoundException} from "../exception/UserException";
import { PaginationDto } from "../../shared/dto/pagination.dto";
import bcrypt from "bcryptjs";
import {AuthenticationException} from "../exception/AuthenticatioException";

interface IUserService {
  createUser(payload: CreateUserDTO): Promise<void>;

  updateUser(payload: UpdateUserDTO, authenticatedUser: string): Promise<void>;

  deleteUser(id: string, authenticatedUser: string): Promise<void>;

  findUserById(id: string): Promise<UserResponseDTO | null>;

  findAllUsers(payload: PaginationDto): Promise<FindAllUserDTO>;
}

export class UserService implements IUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async findAllUsers(payload: PaginationDto): Promise<FindAllUserDTO> {
    const users = await this.userRepository.findUsers(
      payload.page,
      payload.perPage,
      payload.sort,
      payload.sortBy,
      payload.search
    );
    const userCount = await this.userRepository.count();

    return {
      users: users.map((u: UserResponseDTO) => {
        return {
          id: u.id,
          username: u.username,
          name: u.name,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        } as UserResponseDTO;
      }),
      size: userCount,
      totalPages: Math.ceil(userCount / payload.perPage),
    };
  }

  public async findUserById(id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UserNotFoundException("user not found");
    }

    return {
      username: user.username,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserResponseDTO;
  }

  public async createUser(payload: CreateUserDTO): Promise<void> {
    const user = await this.userRepository.findUserByUsername(payload.username);
    if (user != null) {
      throw new UserAlreadyExistsException(
        `user with username ${payload.username} already exists`
      );
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(payload.password, passwordSalt);
    const userModel: Prisma.UserCreateInput = {
      ...payload,
      password: passwordHash,
    };

    await this.userRepository.createUser(userModel);
  }

  public async updateUser(payload: UpdateUserDTO, authenticatedUser: string): Promise<void> {
    if (payload.id == "") {
      throw new UserNotFoundException("user not found");
    }

    let user = await this.userRepository.findUserById(payload.id || "");
    if (!user) {
      throw new UserNotFoundException("user not found");
    }

    if (authenticatedUser !== user.id) {
      throw new AuthenticationException("You don't have access to this user");
    }

    user = await this.userRepository.findUserByUsername(payload.username ?? "");
    if (user) {
      throw new UserAlreadyExistsException(
        `user with username ${payload.username} already exists`
      );
    }

    const updatePayload: Prisma.UserUpdateInput = {
      username: payload.username,
      name: payload.name,
      password: payload.password,
    };
    await this.userRepository.updateUser(payload.id || "", updatePayload);
  }

  public async deleteUser(id: string, authenticatedUser: string): Promise<void> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new UserNotFoundException("user not found");
    }

    if (authenticatedUser !== user.id) {
      throw new AuthenticationException("You don't have access to this user");
    }

    await this.userRepository.deleteUser(id);
  }
}
