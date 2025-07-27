import {Article, Prisma} from "../../../infrastructures/database/generated/prisma";
import {prisma} from "../../../infrastructures/database/prisma";
import ArticleGetPayload = Prisma.ArticleGetPayload;

export interface IArticleRepository {
  count(): Promise<number>;

  findAll(page: number, perPage: number, sort: string, sortBy: string, search: string): Promise<Article[]>;

  findById(id: string): Promise<ArticleGetPayload<{
    include: {
      author: true
    }
  }> | null>

  create(payload: Prisma.ArticleCreateInput): Promise<void>;

  update(id: string, payload: Prisma.ArticleUpdateInput): Promise<void>;

  delete(id: string): Promise<void>;
}

export class ArticleRepository implements IArticleRepository {
  public async count(): Promise<number> {
    return prisma.article.count();
  }

  public async findAll(page: number, perPage: number, sort: string, sortBy: string, search: string): Promise<Article[]> {
    let where: object = {
      // status: {
      //   equals: "PUBLISHED"
      // }
    };

    if (search != "") {
      where = {
        title: {
          contains: search
        }
        // status: {
        //   equals: "PUBLISHED"
        // }
      };
    }

    return prisma.article.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        [sortBy]: sort,
      },
      where: where
    });
  }

  public async findById(id: string): Promise<ArticleGetPayload<{
    include: {
      author: true
    }
  }> | null> {
    return prisma.article.findFirst({
      where: {
        id: id,
      },
      include: {
        author: true,
      }
    });
  }

  public async create(payload: Prisma.ArticleCreateInput): Promise<void> {
    await prisma.article.create({
      data: payload,
    });
  }

  public async update(id: string, payload: Prisma.ArticleUpdateInput): Promise<void> {
    await prisma.article.update({
      data: payload,
      where: {
        id: id
      }
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.article.delete({
      where: {
        id: id
      }
    });
  }
}
