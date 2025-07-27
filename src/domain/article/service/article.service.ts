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

export interface IArticleService {
  findById(id: string): Promise<ArticleDetailResponseDTO | undefined>;

  findAll(payload: PaginationDto): Promise<FindAllArticlesDTO>;

  create(payload: CreateArticleDTO): Promise<void>;

  update(payload: UpdateArticleDTO): Promise<void>;

  delete(id: string): Promise<void>;
}

export class ArticleService implements IArticleService {

  private articleRepository: IArticleRepository;

  constructor(articleRepository: IArticleRepository) {
    this.articleRepository = articleRepository;
  }

  public async findAll(payload: PaginationDto): Promise<FindAllArticlesDTO> {
    const articleCount = await this.articleRepository.count();
    const articles = await this.articleRepository.findAll(
      payload.page, payload.perPage,
      payload.sort, payload.sortBy, payload.search
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
      totalPages: Math.ceil(articleCount / articles.length),
    } as FindAllArticlesDTO;
  }

  public async findById(id: string): Promise<ArticleDetailResponseDTO | undefined> {
    const article = await this.articleRepository.findById(id);
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

  public async create(payload: CreateArticleDTO): Promise<void> {
    const createPayload: Prisma.ArticleCreateInput = {
      ...payload,
      author: {
        connect: {
          id: "6884fe51dc34c1d9cabfa4ff"
        }
      }
    };
    await this.articleRepository.create(createPayload);
  }

  public async update(payload: UpdateArticleDTO): Promise<void> {
    if (payload.id == "") {
      throw new ArticleNotFoundException("Article not found");
    }
    const article = this.articleRepository.findById(payload.id || "");
    if (!article) {
      throw new ArticleNotFoundException("Article not found");
    }

    const updatePayload: Prisma.ArticleUpdateInput = {
      status: payload.status,
      title: payload.title,
      content: payload.content,
    };
    await this.articleRepository.update(payload.id || "", updatePayload);
  }

  public async delete(id: string): Promise<void> {
    const article = this.articleRepository.findById(id);
    if (!article) {
      throw new ArticleNotFoundException("Article not found");
    }

    await this.articleRepository.delete(id);
  }

}
