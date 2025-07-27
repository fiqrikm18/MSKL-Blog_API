import {Article, Prisma,} from "../../../infrastructures/database/generated/prisma";
import {prisma} from "../../../infrastructures/database/prisma";
import ArticleGetPayload = Prisma.ArticleGetPayload;

export interface IArticleRepository {
  count(
    page: number,
    perPage: number,
    sort: string,
    sortBy: string,
    search: string,
    authenticated: boolean
  ): Promise<number>;

  findAll(
    page: number,
    perPage: number,
    sort: string,
    sortBy: string,
    search: string,
    authenticated: boolean
  ): Promise<Article[]>;

  findById(id: string, authenticated: boolean): Promise<ArticleGetPayload<{
    include: {
      author: true;
    };
  }> | null>;

  create(payload: Prisma.ArticleCreateInput): Promise<void>;

  update(id: string, payload: Prisma.ArticleUpdateInput): Promise<void>;

  delete(id: string): Promise<void>;
}

export class ArticleRepository implements IArticleRepository {
  public async count
  (page: number,
   perPage: number,
   sort: string,
   sortBy: string,
   search: string,
   authenticated: boolean
  ): Promise<number> {
    const whereClause: Prisma.ArticleWhereInput = {
      ...(authenticated ? {} : {status: "PUBLISHED"}),
      ...(search && {
        OR: [
          {title: {contains: search, mode: "insensitive"}},
          {content: {contains: search, mode: "insensitive"}},
        ]
      })
    };

    return prisma.article.count({where: whereClause});
  }

  public async findAll(
    page: number,
    perPage: number,
    sort: string,
    sortBy: string,
    search: string,
    authenticated: boolean
  ): Promise<Article[]> {
    const whereClause: Prisma.ArticleWhereInput = {
      ...(authenticated ? {} : {status: "PUBLISHED"}),
      ...(search && {
        OR: [
          {title: {contains: search, mode: "insensitive"}},
          {content: {contains: search, mode: "insensitive"}},
        ]
      })
    };

    return prisma.article.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sort === "desc" ? "desc" : "asc",
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });
  }

  public async findById(id: string, authenticated: boolean): Promise<ArticleGetPayload<{
    include: {
      author: true;
    };
  }> | null> {

    const whereClause: Prisma.ArticleWhereInput = {
      ...(authenticated ? {} : {status: "PUBLISHED"}),
      id: id
    };
    return prisma.article.findFirst({
      where: whereClause,
      include: {
        author: true,
      },
    });
  }

  public async create(payload: Prisma.ArticleCreateInput): Promise<void> {
    await prisma.article.create({
      data: {
        title: payload.title,
        content: payload.content,
        status: payload.status,
        author: payload.author,
      },
    });
  }

  public async update(
    id: string,
    payload: Prisma.ArticleUpdateInput
  ): Promise<void> {
    await prisma.article.update({
      data: payload,
      where: {
        id: id,
      },
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.article.delete({
      where: {
        id: id,
      },
    });
  }
}
