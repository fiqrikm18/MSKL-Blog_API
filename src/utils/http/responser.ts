export interface SuccessResponse<T> {
  code: number;
  message: string;
  data: T
}

export interface ErrorResponse {
  code: number;
  message: string;
  cause?: string;
}

export interface PaginationResponse<T> {
  code: number;
  message: string;
  pagination: PaginationOptions;
  data: T
}

interface PaginationOptions {
  page: number;
  size: number;
  perPage: number;
  totalPage: number;
  hasNextPage: boolean;
}

