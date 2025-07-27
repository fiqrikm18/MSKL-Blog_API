import {Request, Response} from "express";
import {IAuthenticationService} from "../service/authentication.service";
import {LoginResponseDTO, loginSchema} from "../dto/authentication.dto";
import {ErrorResponse, SuccessResponse} from "../../../utils/http/responser";
import {ZodError} from "zod";
import {UserAlreadyExistsException, UserNotFoundException,} from "../exception/UserException";
import jwt, {JwtPayload} from "jsonwebtoken";
import {AuthenticationException, UserNotAuthenticatedException} from "../exception/AuthenticatioException";

export interface IAuthenticationController {
  login(req: Request, res: Response): Promise<Response<LoginResponseDTO>>;

  logout(req: Request, res: Response): Promise<Response<SuccessResponse<null> | ErrorResponse>>;
}

export class AuthenticationController implements IAuthenticationController {
  private readonly authenticationService: IAuthenticationService;

  constructor(authenticationService: IAuthenticationService) {
    this.authenticationService = authenticationService;
  }

  public async login(
    req: Request,
    res: Response
  ): Promise<Response<LoginResponseDTO>> {
    try {
      const loginDto = loginSchema.parse(req.body);
      const token = await this.authenticationService.login(loginDto);
      return res.status(200).json({
        code: 200,
        message: "Login successful",
        data: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessTokenExpiresIn: token.accessTokenExpiresIn,
          refreshTokenExpiresIn: token.refreshTokenExpiresIn,
        },
      } as SuccessResponse<LoginResponseDTO>);
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof UserAlreadyExistsException
      ) {
        return res.status(error.getCode()).json({
          code: error.getCode(),
          message: error.message,
        } as ErrorResponse);
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          cause: JSON.parse(error.message),
        });
      }

      return res.status(500).json({
        code: 500,
        message: "something went wrong",
        cause: (error as Error).message,
      } as ErrorResponse);
    }
  }

  public async logout(req: Request, res: Response): Promise<Response<SuccessResponse<null> | ErrorResponse>> {
    try {
      const decoded = jwt.verify(req.headers["authorization"]?.split(" ")[1] as string, process.env.ACCESS_TOKEN_SECRET as string);
      await this.authenticationService.logout((decoded as JwtPayload).uid);
      return res.status(200).json({
        code: 200,
        message: "Logout successful",
        data: null
      } as SuccessResponse<null>);
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof UserAlreadyExistsException ||
        error instanceof AuthenticationException ||
        error instanceof UserNotAuthenticatedException
      ) {
        return res.status(error.getCode()).json({
          code: error.getCode(),
          message: error.message,
        } as ErrorResponse);
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          cause: JSON.parse(error.message),
        });
      }

      return res.status(500).json({
        code: 500,
        message: "something went wrong",
        cause: (error as Error).message,
      } as ErrorResponse);
    }
  }
}
