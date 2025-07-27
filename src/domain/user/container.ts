import {Router} from "express";
import {IUserController, UserController} from "./controller/user.controller";
import {UserRepository} from "./repository/user.repository";
import {UserService} from "./service/user.service";
import {bindAll} from "../../utils/binding";

export class UserContainer {
  public static readonly containerName = "UserContainer";
  public static readonly apiPrefix = "/users";

  public static setup(router: Router): void {
    const controller = this._createController();

    router.get(`${UserContainer.apiPrefix}/`, controller.getAll);
    router.post(`${UserContainer.apiPrefix}/`, controller.create);
    router.get(`${UserContainer.apiPrefix}/:id`, controller.getById);
    router.patch(`${UserContainer.apiPrefix}/:id`, controller.update);
    router.delete(`${UserContainer.apiPrefix}/:id`, controller.delete);
  }

  private static _createController(): IUserController {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const controller = new UserController(userService);
    return bindAll(controller);
  }
}
