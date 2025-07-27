import {Request, Response} from "express";
import {ErrorResponse, SuccessResponse} from "../../../utils/http/responser";
import {IPageViewService} from "../service/page_view.service";
import {
  aggregatePageViewQuerySchema,
  IPageViewAggregatedResponseDTO,
  IPageViewCountResponseDto,
  pageViewQuerySchema,
} from "../dto/page_view.dto";

export interface IPageViewController {
  createPageView(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

  countPageView(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<IPageViewCountResponseDto> | ErrorResponse>>;

  aggregatePageView(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<IPageViewAggregatedResponseDTO[]> | ErrorResponse>>;
}

export class PageViewController implements IPageViewController {
  private readonly pageViewService: IPageViewService;

  constructor(pageViewService: IPageViewService) {
    this.pageViewService = pageViewService;
  }

  async aggregatePageView(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<IPageViewCountResponseDto[]> | ErrorResponse>> {
    const payload = aggregatePageViewQuerySchema.parse(req.query);
    const aggregatedData = await this.pageViewService.aggregatePageView(payload);
    return res.status(200).json({
      code: 200,
      message: "fetch aggregated data success",
      data: aggregatedData
    } as SuccessResponse<IPageViewAggregatedResponseDTO[]>);
  }

  async countPageView(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<IPageViewCountResponseDto> | ErrorResponse>> {
    const payload = pageViewQuerySchema.parse(req.query);

    return res.status(200).json({
      code: 200,
      message: "Page view count retrieved successfully",
      data: {
        totalViews: await this.pageViewService.countPageView(payload),
        //   articles: [],
      } as IPageViewCountResponseDto,
    } as SuccessResponse<IPageViewCountResponseDto>);
  }

  async createPageView(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const {articleId} = req.body;
    await this.pageViewService.createPageView(
      articleId,
      req.user?.userId || ""
    );
    return res.status(201).json({
      code: 201,
      message: "Page view created successfully",
      data: undefined,
    } as SuccessResponse<undefined>);
  }
}
