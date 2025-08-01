import {z} from "zod";

export const createUserDto = z.object({
  name: z.string().nonempty().nonoptional(),
  username: z.string().nonempty().min(5).max(25).nonoptional(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type CreateUserDTO = z.infer<typeof createUserDto>;

export const updateUserDto = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  username: z.string().min(5).max(25).optional(),
  password: z.string().optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserDto>;

export interface UserResponseDTO {
  id: string;
  username: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FindAllUserDTO {
  users: UserResponseDTO[];
  size: number;
  totalPages: number;
}

