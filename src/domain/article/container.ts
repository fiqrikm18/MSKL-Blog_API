import {Router} from "express";
import {ArticleController, IArticleController} from "./controller/article.controller";
import {ArticleRepository, IArticleRepository} from "./repository/article.repository";
import {ArticleService, IArticleService} from "./service/article.service";
import { authenticate } from "../../middlewares/authentication.middleware";
import { IPageViewRepository, PageViewRepository } from "./repository/page_view.repository";
import { IPageViewController, PageViewController } from "./controller/page_view.controller";
import { IPageViewService, PageViewService } from "./service/page_view.service";
import {bindAndHandleAll} from "../../utils/binding";

export class ArticleContainer {
  public static readonly containerName = "UserContainer";
  public static readonly apiPrefix = "/articles";
  public static readonly pageViewApiPrefix = "/page-views";

  public static setup(router: Router): void {
    const articleController:IArticleController = this._createArticleController();
    const pageViewController:IPageViewController = this._createPageViewController();

    const securedPageViewRouter = Router();
    securedPageViewRouter.use(authenticate);
    securedPageViewRouter.post("/", pageViewController.createPageView);
    securedPageViewRouter.get("/count", pageViewController.countPageView);
    securedPageViewRouter.get("/aggregate-date", pageViewController.aggregatePageView);

    const securedArticleRouter = Router();
    securedArticleRouter.use(authenticate);
    securedArticleRouter.get("/", articleController.getAll);
    securedArticleRouter.post("/", articleController.create);
    securedArticleRouter.get("/:id", articleController.getById);
    securedArticleRouter.patch("/:id", articleController.update);
    securedArticleRouter.delete("/:id", articleController.delete);

    router.use(ArticleContainer.apiPrefix, securedArticleRouter);
    router.use(ArticleContainer.pageViewApiPrefix, securedPageViewRouter);
  }

  private static _createArticleController(): IArticleController {
    const articleRepository: IArticleRepository = new ArticleRepository();
    const articleService: IArticleService = new ArticleService(articleRepository);
    const articleCont: IArticleController = new ArticleController(articleService);
    return bindAndHandleAll(articleCont);
  }

  private static _createPageViewController(): IPageViewController {
    const pageViewRepository: IPageViewRepository = new PageViewRepository();
    const pageViewService: IPageViewService = new PageViewService(pageViewRepository);
    const pageViewCont: IPageViewController = new PageViewController(pageViewService);
    return bindAndHandleAll(pageViewCont);
  }
}
