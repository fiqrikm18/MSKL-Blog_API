import {Request, Response} from "express";
import {ErrorResponse, PaginationResponse, SuccessResponse,} from "../../../utils/http/responser";
import {UserService} from "../service/user.service";
import {createUserDto, updateUserDto, UserResponseDTO} from "../dto/user.dto";
import {PaginationDto} from "../../shared/dto/pagination.dto";

export interface IUserController {
  getAll(
    req: Request,
    res: Response
  ): Promise<Response<PaginationResponse<UserResponseDTO> | ErrorResponse>>;

  getById(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

  create(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

  update(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;

  delete(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>>;
}

export class UserController implements IUserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getAll(
    req: Request,
    res: Response
  ): Promise<Response<PaginationResponse<UserResponseDTO> | ErrorResponse>> {
    const {page, perPage, sort, sortBy, search} = req.query;
    const paginationDto: PaginationDto = {
      page: Number(page as string) || 1,
      perPage: Number(perPage as string) || 10,
      sort: (sort as string) || "desc",
      sortBy: (sortBy as string) || "createdAt",
      search: (search as string) || "",
    };

    const findUsers = await this.userService.findAllUsers(paginationDto);
    return res.status(200).json({
      code: 200,
      message: "fetch user successfully",
      data: findUsers.users,
      pagination: {
        page: Number(page as string) || 1,
        perPage: Number(perPage as string) || 10,
        size: findUsers.size,
        totalPage: findUsers.totalPages,
        hasNextPage: (Number(page as string) || 1) < findUsers.totalPages,
      },
    } as PaginationResponse<UserResponseDTO[]>);
  }

  public async getById(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const {id} = req.params;
    const user = await this.userService.findUserById(id);

    return res.status(200).json({
      code: 200,
      message: "fetch user successfully",
      data: user,
    } as SuccessResponse<UserResponseDTO>);
  }

  public async create(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const dto = createUserDto.parse(req.body);
    await this.userService.createUser(dto);
    return res.status(201).json({
      code: 201,
      message: "Create user success",
      data: undefined,
    } as SuccessResponse<undefined>);
  }

  public async update(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const {id} = req.params;
    const dto = updateUserDto.parse(req.body);
    dto.id = id;

    await this.userService.updateUser(dto, req.user?.userId || "");
    return res.status(200).json({
      code: 200,
      message: "Update user success",
      data: undefined,
    } as SuccessResponse<undefined>);
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<Response<SuccessResponse<undefined> | ErrorResponse>> {
    const {id} = req.params;
    await this.userService.deleteUser(id, req.user?.userId || "");
    return res.status(200).json({
      code: 200,
      message: "delete user success",
      data: undefined,
    } as SuccessResponse<undefined>);
  }
}
