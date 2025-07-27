import {IArticleRepository} from "../repository/article.repository";
import {
  ArticleDetailResponseDTO,
  ArticleListResponseDTO,
  CreateArticleDTO,
  FindAllArticlesDTO,
  UpdateArticleDTO
} from "../dto/article.dto";
import {ArticleNotFoundException} from "../exception/ArticleNotFoundException";
import {Prisma} from "../../../infrastructures/database/generated/prisma";
import {UserResponseDTO} from "../../user/dto/user.dto";
import {PaginationDto} from "../../shared/dto/pagination.dto";
import {AuthenticationException} from "../../user/exception/AuthenticatioException";

export interface IArticleService {
  findById(id: string, isAuthenticated: boolean): Promise<ArticleDetailResponseDTO | undefined>;

  findAll(payload: PaginationDto, isAuthenticated: boolean): Promise<FindAllArticlesDTO>;

  create(payload: CreateArticleDTO, author: string): Promise<void>;

  update(payload: UpdateArticleDTO, authenticatedUser: string): Promise<void>;

  delete(id: string, authenticatedUser: string): Promise<void>;
}

export class ArticleService implements IArticleService {

  private readonly articleRepository: IArticleRepository;

  constructor(articleRepository: IArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async findAll(payload: PaginationDto, isAuthenticated: boolean): Promise<FindAllArticlesDTO> {
    const articleCount = await this.articleRepository.count(
      payload.page, payload.perPage,
      payload.sort, payload.sortBy,
      payload.search,
      isAuthenticated
    );
    const articles = await this.articleRepository.findAll(
      payload.page, payload.perPage,
      payload.sort, payload.sortBy,
      payload.search,
      isAuthenticated
    );

    return {
      articles: articles.map(value => {
        return {
          id: value.id,
          title: value.title,
          status: value.status,
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        } as ArticleListResponseDTO;
      }),
      size: articleCount,
      totalPages: articleCount === 0 ? 0 : Math.ceil(articleCount / articles.length),
    } as FindAllArticlesDTO;
  }

  public async findById(id: string, isAuthenticated: boolean): Promise<ArticleDetailResponseDTO | undefined> {
    const article = await this.articleRepository.findById(id, isAuthenticated);
    if (!article) {
      throw new ArticleNotFoundException("article not found");
    }

    return {
      id: article.id,
      title: article.title,
      status: article.status,
      content: article.content,
      totalViews: 0,
      author: {
        username: article.author.username,
        name: article.author.name,
        createdAt: article.author.createdAt,
        updatedAt: article.author.updatedAt,
      } as UserResponseDTO,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    } as ArticleDetailResponseDTO;
  }

  public async create(payload: CreateArticleDTO, author: string): Promise<void> {
    const createPayload: Prisma.ArticleCreateInput = {
      ...payload,
      author: {
        connect: {
          id: author
        }
      }
    };
    await this.articleRepository.create(createPayload);
  }

  public async update(payload: UpdateArticleDTO, authenticatedUser: string): Promise<void> {
    if (payload.id == "") {
      throw new ArticleNotFoundException("Article not found");
    }
    const article = await this.articleRepository.findById(payload.id || "", true);
    if (!article) {
      throw new ArticleNotFoundException("Article not found");
    }

    if (authenticatedUser !== article.author.id) {
      throw new AuthenticationException("You don't have access to this article");
    }

    const updatePayload: Prisma.ArticleUpdateInput = {
      status: payload.status,
      title: payload.title,
      content: payload.content,
    };
    await this.articleRepository.update(payload.id || "", updatePayload);
  }

  public async delete(id: string, authenticatedUser: string): Promise<void> {
    const article = await this.articleRepository.findById(id, true);
    if (!article) {
      throw new ArticleNotFoundException("Article not found");
    }

    if (authenticatedUser !== article.author.id) {
      throw new AuthenticationException("You don't have access to this article");
    }

    await this.articleRepository.delete(id);
  }

}
