import {Prisma, UserToken} from "../../../infrastructures/database/generated/prisma";
import {prisma} from "../../../infrastructures/database/prisma";

export interface IUserTokenRepository {
  createToken(payload: Prisma.UserTokenCreateInput): Promise<void>;

  findTokenByUID(uid: string): Promise<UserToken | null>;

  revokeToken(id: string): Promise<void>;
}

export class UserTokenRepository implements IUserTokenRepository {

  async findTokenByUID(uid: string): Promise<UserToken | null> {
    return prisma.userToken.findFirst({
      where: {
        OR: [
          {
            accessTokenId: {
              equals: uid,
            }
          },
          {
            refreshTokenId: {
              equals: uid,
            }
          }
        ]
      }
    });
  }

  async revokeToken(id: string): Promise<void> {
    await prisma.userToken.update({
      data: {
        revoked: true
      },
      where: {
        id: id
      }
    });
  }

  async createToken(payload: Prisma.UserTokenCreateInput): Promise<void> {
    await prisma.userToken.create({
      data: payload,
    });
  }

}
