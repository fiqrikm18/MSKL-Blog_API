import {IArticleService} from "../service/article.service";
import {Request, Response} from "express";
import {ErrorResponse, PaginationResponse, SuccessResponse} from "../../../utils/http/responser";
import {
  ArticleDetailResponseDTO,
  ArticleListResponseDTO,
  CreateArticleDTO,
  createArticleSchema,
  UpdateArticleDTO,
  updateArticleSchema
} from "../dto/article.dto";
import {PaginationDto} from "../../shared/dto/pagination.dto";

export interface IArticleController {

  getAll(req: Request, res: Response): Promise<Response<PaginationResponse<undefined> | ErrorResponse>>;

  getById(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

  create(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

  update(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

  delete(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

}

export class ArticleController implements IArticleController {

  private readonly articleService: IArticleService;

  constructor(articleService: IArticleService) {
    this.articleService = articleService;
  }

  public async getAll(req: Request, res: Response): Promise<Response<PaginationResponse<ArticleListResponseDTO[]> | ErrorResponse>> {
    const {page, perPage, sort, sortBy, search} = req.query;
    const paginationDto: PaginationDto = {
      page: Number(page as string) || 1,
      perPage: Number(perPage as string) || 10,
      sort: sort as string || "desc",
      sortBy: sortBy as string || "createdAt",
      search: search as string || ""
    };

    const isAuthenticated = !!req.user;
    const findArticles = await this.articleService.findAll(paginationDto, isAuthenticated);
    return res.status(200).json({
      code: 200,
      message: "fetch articles successfully",
      data: findArticles.articles,
      pagination: {
        page: Number(page as string) || 1,
        perPage: Number(perPage as string) || 10,
        size: findArticles.size,
        totalPage: findArticles.totalPages,
        hasNextPage: (Number(page as string) || 1) < findArticles.totalPages
      }
    } as PaginationResponse<ArticleListResponseDTO[]>);
  }

  public async getById(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const {id} = req.params;
    const isAuthenticated = !!req.user;
    const article = await this.articleService.findById(id, isAuthenticated);
    return res.status(200).json({
      code: 200,
      message: "fetch article successfully",
      data: article,
    } as SuccessResponse<ArticleDetailResponseDTO>);
  }

  public async create(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const payload: CreateArticleDTO = createArticleSchema.parse(req.body);
    payload.authorId = req.user?.userId || "";

    await this.articleService.create(payload, req.user?.userId || "");
    return res.status(201).json({
      code: 201,
      message: "Successfully created article",
      data: undefined,
    } as SuccessResponse<undefined>);
  }

  public async update(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const {id} = req.params;
    const payload: UpdateArticleDTO = updateArticleSchema.parse(req.body);
    payload.id = id;
    await this.articleService.update(payload, req.user?.userId || "");
    return res.status(200).json({
      code: 200,
      message: "Successfully updated article",
      data: undefined,
    } as SuccessResponse<undefined>);
  }

  public async delete(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const {id} = req.params;
    await this.articleService.delete(id, req.user?.userId || "");
    return res.status(200).json({
      code: 200,
      message: "delete article successfully",
      data: undefined
    } as SuccessResponse<undefined>);
  }

}
