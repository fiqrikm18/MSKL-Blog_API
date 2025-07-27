import {Router} from "express";
import {bindAll} from "../../utils/binding";
import {ArticleController, IArticleController} from "./controller/article.controller";
import {ArticleRepository, IArticleRepository} from "./repository/article.repository";
import {ArticleService, IArticleService} from "./service/article.service";

export class ArticleContainer {
  public static readonly containerName = "UserContainer";
  public static readonly apiPrefix = "/articles";

  public static setup(router: Router): void {
    const controller:IArticleController = this._createController();

    router.get(`${ArticleContainer.apiPrefix}/`, controller.getAll);
    router.post(`${ArticleContainer.apiPrefix}/`, controller.create);
    router.get(`${ArticleContainer.apiPrefix}/:id`, controller.getById);
    router.patch(`${ArticleContainer.apiPrefix}/:id`, controller.update);
    router.delete(`${ArticleContainer.apiPrefix}/:id`, controller.delete);
  }

  private static _createController(): IArticleController {
    const articleRepository: IArticleRepository = new ArticleRepository();
    const articleService: IArticleService = new ArticleService(articleRepository);
    const articleCont: IArticleController = new ArticleController(articleService);
    return bindAll(articleCont);
  }
}
