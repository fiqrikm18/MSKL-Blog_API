import {Request, Response} from "express";
import {IAuthenticationService} from "../service/authentication.service";
import {LoginResponseDTO, loginSchema} from "../dto/authentication.dto";
import {ErrorResponse, SuccessResponse} from "../../../utils/http/responser";
import jwt, {JwtPayload} from "jsonwebtoken";

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
  }

  public async logout(req: Request, res: Response): Promise<Response<SuccessResponse<null> | ErrorResponse>> {
    const decoded = jwt.verify(req.headers["authorization"]?.split(" ")[1] as string, process.env.ACCESS_TOKEN_SECRET as string);
    await this.authenticationService.logout((decoded as JwtPayload).uid);
    return res.status(200).json({
      code: 200,
      message: "Logout successful",
      data: null
    } as SuccessResponse<null>);
  }
}
