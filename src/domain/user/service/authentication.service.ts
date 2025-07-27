import {LoginDTO} from "../dto/authentication.dto";
import {AuthenticationException} from "../exception/AuthenticatioException";
import {IUserRepository} from "../repository/user.repository";
import {IUserTokenRepository} from "../repository/user_token.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {Prisma} from "../../../infrastructures/database/generated/prisma";

export interface LoginReturn {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface IAuthenticationService {
  login(payload: LoginDTO): Promise<LoginReturn>;

  logout(uid: string): Promise<void>;
}

export class AuthenticationService implements IAuthenticationService {
  private readonly userTokenRepository: IUserTokenRepository;
  private readonly userRepository: IUserRepository;

  constructor(
    userTokenRepository: IUserTokenRepository,
    userRepository: IUserRepository
  ) {
    this.userTokenRepository = userTokenRepository;
    this.userRepository = userRepository;
  }

  async login(payload: LoginDTO): Promise<LoginReturn> {
    const user = await this.userRepository.findUserByUsername(payload.username);
    if (!user) {
      throw new AuthenticationException("Invalid username or password");
    }

    bcrypt.compare(payload.password, user.password, (err, result) => {
      if (err || !result) {
        throw new AuthenticationException("Invalid username or password");
      }
    });

    const accessTokenUID = crypto.randomUUID();
    const accessToken = jwt.sign(
      {userId: user.id, username: user.username, uid: accessTokenUID},
      process.env.ACCESS_TOKEN_SECRET || "defaultAccessSecret",
      {expiresIn: "1h"}
    );

    const refreshTokenUID = crypto.randomUUID();
    const refreshToken = jwt.sign(
      {userId: user.id, username: user.username, id: refreshTokenUID},
      process.env.REFRESH_TOKEN_SECRET || "defaultRefreshSecret",
      {expiresIn: "2h"}
    );

    const userTokenPayload: Prisma.UserTokenCreateInput = {
      accessTokenId: accessTokenUID,
      refreshTokenId: refreshTokenUID,
      revoked: false,
      user: {
        connect: {
          id: user.id
        }
      }
    };
    await this.userTokenRepository.createToken(userTokenPayload);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresIn: 7200,
    };
  }

  async logout(uid: string): Promise<void> {
    const userToken = await this.userTokenRepository.findTokenByUID(uid);
    if (!userToken) {
      throw new AuthenticationException("Invalid token provided");
    }

    if (userToken.revoked) {
      throw new AuthenticationException("Invalid token provided");
    }

    await this.userTokenRepository.revokeToken(userToken.id);
  }
}
