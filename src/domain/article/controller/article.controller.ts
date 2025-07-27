import {IArticleService} from "../service/article.service";
import {Request, Response} from "express";
import {ErrorResponse, PaginationResponse, SuccessResponse} from "../../../utils/http/responser";
import {ZodError} from "zod";
import {ArticleNotFoundException} from "../exception/ArticleNotFoundException";
import {
  ArticleDetailResponseDTO, ArticleListResponseDTO,
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

  private articleService: IArticleService;

  constructor(articleService: IArticleService) {
    this.articleService = articleService;
  }

  public async getAll(req: Request, res: Response): Promise<Response<PaginationResponse<ArticleListResponseDTO[]> | ErrorResponse>> {
    try {
      const {page, perPage, sort, sortBy, search} = req.query;
      const paginationDto: PaginationDto = {
        page: Number(page as string) || 1,
        perPage: Number(perPage as string) || 10,
        sort: sort as string || "desc",
        sortBy: sortBy as string || "createdAt",
        search: search as string || ""
      };

      const findArticles = await this.articleService.findAll(paginationDto);
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
    } catch (error) {
      // TODO: move to global handler
      if (error instanceof ArticleNotFoundException) {
        return res.status(error.getCode()).json({
          code: error.getCode(),
          message: error.message,
        } as ErrorResponse);
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          cause: JSON.parse(error.message)
        });
      }

      return res.status(500).json({
        code: 500,
        message: "something went wrong",
        cause: (error as Error).message
      } as ErrorResponse);
    }
  }

  public async getById(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    try {
      const {id} = req.params;
      const article = await this.articleService.findById(id);
      return res.status(200).json({
        code: 200,
        message: "fetch article successfully",
        data: article,
      } as SuccessResponse<ArticleDetailResponseDTO>);
    } catch (error) {
      // TODO: move to global handler
      if (error instanceof ArticleNotFoundException) {
        return res.status(error.getCode()).json({
          code: error.getCode(),
          message: error.message,
        } as ErrorResponse);
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          cause: JSON.parse(error.message)
        });
      }

      return res.status(500).json({
        code: 500,
        message: "something went wrong",
        cause: (error as Error).message
      } as ErrorResponse);
    }
  }

  public async create(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    try {
      const payload: CreateArticleDTO = createArticleSchema.parse(req.body);
      await this.articleService.create(payload);
      return res.status(201).json({
        code: 201,
        message: "Successfully created article",
        data: undefined,
      } as SuccessResponse<undefined>);
    } catch (error) {
      // TODO: move to global handler
      if (error instanceof ArticleNotFoundException) {
        return res.status(error.getCode()).json({
          code: error.getCode(),
          message: error.message,
        } as ErrorResponse);
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          cause: JSON.parse(error.message)
        });
      }

      return res.status(500).json({
        code: 500,
        message: "something went wrong",
        cause: (error as Error).message
      } as ErrorResponse);
    }
  }

  public async update(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    try {
      const {id} = req.params;
      const payload: UpdateArticleDTO = updateArticleSchema.parse(req.body);
      payload.id = id;
      await this.articleService.update(payload);
      return res.status(200).json({
        code: 200,
        message: "Successfully updated article",
        data: undefined,
      } as SuccessResponse<undefined>);
    } catch (error) {
      // TODO: move to global handler
      if (error instanceof ArticleNotFoundException) {
        return res.status(error.getCode()).json({
          code: error.getCode(),
          message: error.message,
        } as ErrorResponse);
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          cause: JSON.parse(error.message)
        });
      }

      return res.status(500).json({
        code: 500,
        message: "something went wrong",
        cause: (error as Error).message
      } as ErrorResponse);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    try {
      const {id} = req.params;
      await this.articleService.delete(id);
      return res.status(200).json({
        code: 200,
        message: "delete article successfully",
        data: undefined
      } as SuccessResponse<undefined>);
    } catch (error) {
      // TODO: move to global handler
      if (error instanceof ArticleNotFoundException) {
        return res.status(error.getCode()).json({
          code: error.getCode(),
          message: error.message,
        } as ErrorResponse);
      }

      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: "something went wrong",
          cause: JSON.parse(error.message)
        });
      }

      return res.status(500).json({
        code: 500,
        message: "something went wrong",
        cause: (error as Error).message
      } as ErrorResponse);
    }
  }

}
