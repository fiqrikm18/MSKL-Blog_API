import {Request, Response} from "express";
import {SuccessResponse} from "../../../utils/http/responser";
import {constants as HttpStatus} from "node:http2";

export interface IHealthCheckController {
  index(req: Request, res: Response): Response<SuccessResponse<undefined>>
}

export class HealthCheckController implements IHealthCheckController {

  index(_req: Request, _res: Response): Response<SuccessResponse<undefined>> {
    return _res.status(HttpStatus.HTTP_STATUS_OK).json({
      code: _res.statusCode,
      message: "OK",
      data: undefined,
    } as SuccessResponse<undefined>);
  }

}
