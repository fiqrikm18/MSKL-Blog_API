import {AuthenticationException} from "../../user/exception/AuthenticatioException";
import {IPageViewAggregatedResponseDTO, PageViewAggregatedResponseDTO, PageViewQueryDTO} from "../dto/page_view.dto";
import {IPageViewRepository} from "../repository/page_view.repository";
import {eachDayOfInterval, eachHourOfInterval, eachMonthOfInterval, format, parseISO, subDays} from "date-fns";

export interface IPageViewService {
  createPageView(articleId: string, userId: string): Promise<void>;

  countPageView(payload: PageViewQueryDTO): Promise<number>;

  aggregatePageView(payload: PageViewAggregatedResponseDTO): Promise<IPageViewAggregatedResponseDTO[]>;
}

export class PageViewService implements IPageViewService {
  private readonly pageViewRepository: IPageViewRepository;

  constructor(pageViewRepository: IPageViewRepository) {
    this.pageViewRepository = pageViewRepository;
  }

  async aggregatePageView(payload: PageViewAggregatedResponseDTO): Promise<IPageViewAggregatedResponseDTO[]> {
    const {
      interval,
      startAt = subDays(new Date(), 7).toISOString(),
      endAt = new Date().toISOString(),
      articleId
    } = payload;

    const start = parseISO(startAt);
    const end = parseISO(endAt);

    let groupFormat = "yyyy-MM-dd";
    let intervals: Date[] = [];

    if (interval === "hourly") {
      groupFormat = "yyyy-MM-dd HH:00";
      intervals = eachHourOfInterval({start, end});
    } else if (interval === "daily") {
      intervals = eachDayOfInterval({start, end});
    } else if (interval === "monthly") {
      groupFormat = "yyyy-MM";
      intervals = eachMonthOfInterval({start, end});
    }


    const rawViews = await this.pageViewRepository.aggregatePageView(articleId, startAt, endAt);
    const viewsGrouped: Record<string, number> = {};

    rawViews.forEach((view: { createdAt: string | number | Date; }) => {
      const key = format(view.createdAt, groupFormat);
      viewsGrouped[key] = (viewsGrouped[key] || 0) + 1;
    });

    return intervals.map((d) => {
      const key = format(d, groupFormat);
      return {
        date: key,
        totalViews: viewsGrouped[key] || 0,
      };
    });
  }

  async countPageView(payload: PageViewQueryDTO): Promise<number> {
    return await this.pageViewRepository.countPageView(
      payload.articleId,
      payload.startAt,
      payload.endAt
    );
  }

  async createPageView(articleId: string, userId: string): Promise<void> {
    if (!userId && userId.trim() === "") {
      throw new AuthenticationException(
        "User must be authenticated to create a page view"
      );
    }

    await this.pageViewRepository.createPageView(articleId, userId);
  }
}
