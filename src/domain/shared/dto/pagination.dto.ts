import {UserResponseDTO} from "../../user/dto/user.dto";

export interface PaginationDto {
  page: number;
  perPage: number;
  sort: string;
  sortBy: string;
  search: string;
}
