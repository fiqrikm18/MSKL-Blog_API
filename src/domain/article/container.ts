import {Router} from "express";
import {bindAll} from "../../utils/binding";
import {ArticleController, IArticleController} from "./controller/article.controller";
import {ArticleRepository, IArticleRepository} from "./repository/article.repository";
import {ArticleService, IArticleService} from "./service/article.service";
import { authenticate } from "../../middlewares/authentication.middleware";

export class ArticleContainer {
  public static readonly containerName = "UserContainer";
  public static readonly apiPrefix = "/articles";

  public static setup(router: Router): void {
    const controller:IArticleController = this._createController();

    const securedRouter = Router();
    securedRouter.use(authenticate);

    securedRouter.get("/", controller.getAll);
    securedRouter.post("/", controller.create);
    securedRouter.get("/:id", controller.getById);
    securedRouter.patch("/:id", controller.update);
    securedRouter.delete("/:id", controller.delete);

    router.use(ArticleContainer.apiPrefix, securedRouter);
  }

  private static _createController(): IArticleController {
    const articleRepository: IArticleRepository = new ArticleRepository();
    const articleService: IArticleService = new ArticleService(articleRepository);
    const articleCont: IArticleController = new ArticleController(articleService);
    return bindAll(articleCont);
  }
}
