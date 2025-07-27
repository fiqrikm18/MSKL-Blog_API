import {UserResponseDTO} from "../../user/dto/user.dto";
import {z} from "zod";

export interface ArticleListResponseDTO {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleDetailResponseDTO {
  id: string;
  title: string;
  status: string;
  author: UserResponseDTO;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  totalViews: number;
}

export const createArticleSchema = z.object({
  title: z.string().nonempty().nonoptional(),
  content: z.string().nonempty().nonoptional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type CreateArticleDTO = z.infer<typeof updateArticleSchema>;

export const updateArticleSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty().nonoptional(),
  content: z.string().nonempty().nonoptional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).nonoptional(),
});

export type UpdateArticleDTO = z.infer<typeof updateArticleSchema>;

export interface FindAllArticlesDTO {
  articles: ArticleListResponseDTO[];
  size: number;
  totalPages: number;
}
