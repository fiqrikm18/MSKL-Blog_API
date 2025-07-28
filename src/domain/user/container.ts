import {Router} from "express";
import {IUserController, UserController} from "./controller/user.controller";
import {UserRepository} from "./repository/user.repository";
import {UserService} from "./service/user.service";
import {bindAndHandleAll} from "../../utils/binding";
import {AuthenticationController, IAuthenticationController,} from "./controller/authentication.controller";
import {UserTokenRepository} from "./repository/user_token.repository";
import {AuthenticationService} from "./service/authentication.service";
import {authenticate} from "../../middlewares/authentication.middleware";

export class UserContainer {
  public static readonly containerName = "UserContainer";
  public static readonly apiPrefix = "/users";
  public static readonly authApiPrefix = "/auth";

  public static setup(router: Router): void {
    const userController: IUserController = this._createUserController();
    const authenticationController: IAuthenticationController = this._createAuthenticationController();

    router.post(
      `${UserContainer.authApiPrefix}/login`,
      authenticationController.login
    );

    const authenticationSecuredRouter = Router();
    authenticationSecuredRouter.use(authenticate);
    authenticationSecuredRouter.post("/logout", authenticationController.logout);

    const userSecuredRouter = Router();
    userSecuredRouter.use(authenticate);
    userSecuredRouter.get("/", userController.getAll);
    userSecuredRouter.post("/", userController.create);
    userSecuredRouter.get("/:id", userController.getById);
    userSecuredRouter.patch("/:id", userController.update);
    userSecuredRouter.delete("/:id", userController.delete);

    router.use(UserContainer.apiPrefix, userSecuredRouter);
    router.use(UserContainer.authApiPrefix, authenticationSecuredRouter);
  }

  private static _createUserController(): IUserController {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    const controller = new UserController(userService);
    return bindAndHandleAll(controller);
  }

  private static _createAuthenticationController(): IAuthenticationController {
    const userRepository = new UserRepository();
    const userTokenRepository = new UserTokenRepository();
    const authenticationService = new AuthenticationService(
      userTokenRepository,
      userRepository
    );
    const controller = new AuthenticationController(authenticationService);
    return bindAndHandleAll(controller);
  }
}
