import {Router} from "express";
import {HealthCheckController} from "./controller/health_check.controller";

export class HealthCheckContainer {

  public static readonly containerName = "HealthCheckContainer";
  public static readonly apiPrefix: string = "/health-check";

  public static setup(router: Router): void {
    const controller = new HealthCheckController();

    router.get(HealthCheckContainer.apiPrefix, controller.index);
  }

}
