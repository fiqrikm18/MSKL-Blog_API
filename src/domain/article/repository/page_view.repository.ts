import {PageView} from "../../../infrastructures/database/generated/prisma";
import {prisma} from "../../../infrastructures/database/prisma";

export interface IPageViewRepository {
  createPageView(articleId: string, userId: string): Promise<void>;

  countPageView(
    articleId: string | undefined,
    startAt: string | undefined,
    endAt: string | undefined
  ): Promise<number>;

  aggregatePageView(
    articleId: string | undefined,
    startAt: string | undefined,
    endAt: string | undefined,
  ): Promise<PageView[]>;
}

export class PageViewRepository implements IPageViewRepository {

  aggregatePageView(articleId: string | undefined, startAt: string | undefined, endAt: string | undefined): Promise<PageView[]> {
    return prisma.pageView.findMany({
      where: {
        ...(articleId && {articleId}),
        createdAt: {
          gte: startAt,
          lte: endAt,
        },
      },
    });
  }

  async countPageView(
    articleId?: string | undefined,
    startAt?: string | undefined,
    endAt?: string | undefined
  ): Promise<number> {
    const where: any = {};

    if (articleId) where.articleId = articleId;
    if (startAt || endAt) {
      where.createdAt = {};
      if (startAt) where.createdAt.gte = startAt;
      if (endAt) where.createdAt.lte = endAt;
    }

    console.log("Counting page views with conditions:", where);

    return prisma.pageView.count({where});
  }

  async createPageView(articleId: string, userId: string): Promise<void> {
    await prisma.pageView.create({
      data: {
        articleId: articleId,
        viewerId: userId,
      },
    });
  }
}
