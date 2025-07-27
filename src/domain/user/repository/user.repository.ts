import {Prisma, User} from "../../../infrastructures/database/generated/prisma";
import {prisma} from "../../../infrastructures/database/prisma";

export interface IUserRepository {
  count(): Promise<number>;

  findUsers(page: number, perPage: number, sort: string, sortBy: string, search: string): Promise<User[]>;

  findUserByUsername(username: string): Promise<User | null>;

  findUserById(id: string): Promise<User | null>;

  createUser(user: Prisma.UserCreateInput): Promise<User>;

  updateUser(id: string, user: Prisma.UserUpdateInput): Promise<User | null>;

  deleteUser(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  public async count(): Promise<number> {
      return prisma.user.count();
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {username},
    });
  }

  public async findUsers(page: number, perPage: number, sort: string, sortBy: string, search: string): Promise<User[]> {
    let where = {};
    if (search != "") {
      where = {
        OR: [
          {
            username: {
              contains: search
            },
            name: {
              contains: search
            }
          }
        ]
      };
    }

    return prisma.user.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        [sortBy]: sort,
      },
      where: where
    });
  }

  public async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {id},
    });

  }

  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data
    });

  }

  public async updateUser(id: string, user: Prisma.UserUpdateInput): Promise<User | null> {
    return prisma.user.update({
      where: {
        id: id
      },
      data: user
    });

  }

  public async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: {id},
    });
  }
}
