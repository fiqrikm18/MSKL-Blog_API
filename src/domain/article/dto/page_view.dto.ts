import {ArticleListResponseDTO} from "./article.dto";
import {z} from "zod";

export interface IPageViewCountResponseDto {
  totalViews: number;
  articles: ArticleListResponseDTO[];
}

export interface IPageViewAggregatedResponseDTO {
  date: string;
  totalViews: number;
}

export const pageViewQuerySchema = z.object({
  articleId: z.string().optional(),
  startAt: z.iso.datetime().optional(),
  endAt: z.iso.datetime().optional(),
});

export type PageViewQueryDTO = z.infer<typeof pageViewQuerySchema>;

export const IntervalEnum = z.enum(["hourly", "daily", "monthly"]);

export const aggregatePageViewQuerySchema = z.object({
  interval: IntervalEnum,
  startAt: z
    .iso
    .datetime({message: "startAt must be a valid ISO 8601 datetime string"})
    .optional(),
  endAt: z
    .iso
    .datetime({message: "endAt must be a valid ISO 8601 datetime string"})
    .optional(),
  articleId: z.string().optional(),
});

export type PageViewAggregatedResponseDTO = z.infer<typeof aggregatePageViewQuerySchema>;
